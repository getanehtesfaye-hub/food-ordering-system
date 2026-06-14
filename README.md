# Food Ordering Website

A full-stack food ordering application built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication (register, login, profile)
- Restaurant menu with food items
- Shopping cart functionality
- Order system with status tracking
- Admin dashboard for management
- Search and filter functionality
- Responsive design

## Tech Stack

- **Frontend**: React with functional components and hooks
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 16
- **Styling**: Styled-components
- **Theme**: Black and navy blue

## Project Structure

```
food-ordering/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── database.sql
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── package.json
│   └── public/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up PostgreSQL

**Option A — Docker (recommended)**

```bash
cp .env.example .env
npm run db:up
```

This starts PostgreSQL 16, creates the `food_ordering` database, and applies `backend/database.sql` automatically.

**Option B — Local PostgreSQL**

1. Install PostgreSQL from https://www.postgresql.org/download/
2. Copy `backend/.env.example` to `backend/.env` and set your credentials
3. Run the setup script:

```bash
npm run db:setup
```

### 3. Configure environment variables

Update `backend/.env` to match your PostgreSQL instance:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=food_ordering
```

For production or cloud databases, you can use a single connection string instead:

```env
DATABASE_URL=postgresql://user:password@host:5432/food_ordering
```

### 4. Run the application

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000).

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:up` | Start PostgreSQL in Docker |
| `npm run db:down` | Stop PostgreSQL container |
| `npm run db:logs` | View PostgreSQL logs |
| `npm run db:reset` | Reset database (removes all data) |
| `npm run db:setup` | Create database and apply schema (local PostgreSQL) |

### Default admin login

- **Email:** `admin@foodordering.com`
- **Password:** `admin123`

## License

MIT

## Project Size Note

The project folder may appear large (~500–900 MB) because of `node_modules/` (dependencies). This is normal for React and Node.js projects. These folders are excluded from git via `.gitignore`. To reclaim disk space locally, you can delete `node_modules` and run `npm install` again when needed.
