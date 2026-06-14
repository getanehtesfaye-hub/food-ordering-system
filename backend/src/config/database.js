const { Pool } = require('pg');

const buildPoolConfig = () => {
  const poolOptions = {
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_MS || '30000', 10),
    connectionTimeoutMillis: parseInt(
      process.env.DB_CONNECT_TIMEOUT_MS || '5000',
      10
    ),
    ssl:
      process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
        : undefined,
  };

  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ...poolOptions,
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'food_ordering',
    ...poolOptions,
  };
};

const pool = new Pool(buildPoolConfig());

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

const toPgPlaceholders = (sql) => {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
};

const withReturningId = (sql) => {
  const trimmed = sql.trim().replace(/;+$/, '');
  if (/^\s*INSERT/i.test(trimmed) && !/RETURNING/i.test(trimmed)) {
    return `${trimmed} RETURNING id`;
  }
  return trimmed;
};

const getExecutor = (client) => client || pool;

const query = async (sql, params = [], client = null) => {
  try {
    const result = await getExecutor(client).query(
      toPgPlaceholders(sql),
      params
    );
    return result.rows;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

const queryOne = async (sql, params = [], client = null) => {
  const rows = await query(sql, params, client);
  return rows.length > 0 ? rows[0] : null;
};

const insert = async (sql, params = [], client = null) => {
  try {
    const result = await getExecutor(client).query(
      toPgPlaceholders(withReturningId(sql)),
      params
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('Insert execution error:', error.message);
    throw error;
  }
};

const execute = async (sql, params = [], client = null) => {
  try {
    const result = await getExecutor(client).query(
      toPgPlaceholders(sql),
      params
    );
    return result.rowCount;
  } catch (error) {
    console.error('Execution error:', error.message);
    throw error;
  }
};

const beginTransaction = async () => {
  const client = await pool.connect();
  await client.query('BEGIN');
  return client;
};

const commitTransaction = async (client) => {
  await client.query('COMMIT');
  client.release();
};

const rollbackTransaction = async (client) => {
  await client.query('ROLLBACK');
  client.release();
};

const testConnection = async () => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT current_database() AS database');
    console.log(`PostgreSQL connected (${rows[0].database})`);
    client.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const closePool = async () => {
  await pool.end();
};

module.exports = {
  pool,
  query,
  queryOne,
  insert,
  execute,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  testConnection,
  closePool,
};
