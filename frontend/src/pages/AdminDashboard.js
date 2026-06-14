import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Users,
  ShoppingCart,
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  Utensils,
  AlertCircle,
} from 'lucide-react';
import { orderAPI, userAPI } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { formatOrderStatus } from '../utils/orderStatus';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import theme from '../styles/theme';

const DashboardContainer = styled.div`
  min-height: calc(100vh - 140px);
  padding: ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const DashboardTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const DashboardSubtitle = styled.p`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled(Card)`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => props.color};
  }
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.lg};
  background-color: ${(props) => props.color}20;
  color: ${(props) => props.color};
  margin-bottom: ${theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.secondary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.md};
`;

const StatHint = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${(props) => (props.warning ? theme.colors.warning : theme.colors.gray[500])};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  text-decoration: none;
  color: ${theme.colors.white};
  background: linear-gradient(135deg, ${(props) => props.color} 0%, ${(props) => props.color}dd 100%);

  &:hover {
    background: linear-gradient(135deg, ${(props) => props.color}dd 0%, ${(props) => props.color} 100%);
  }
`;

const RecentOrdersCard = styled(Card)``;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.md};

  &:hover {
    background-color: ${theme.colors.gray[100]};
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xs};
`;

const OrderCustomer = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const OrderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  white-space: nowrap;

  ${(props) => {
    switch (props.status) {
      case 'pending':
        return `background-color: ${theme.colors.warning}20; color: ${theme.colors.warning};`;
      case 'preparing':
        return `background-color: ${theme.colors.primary}20; color: ${theme.colors.primary};`;
      case 'ready':
        return `background-color: ${theme.colors.success}20; color: ${theme.colors.success};`;
      case 'delivered':
        return `background-color: ${theme.colors.success}20; color: ${theme.colors.success};`;
      case 'cancelled':
        return `background-color: ${theme.colors.error}20; color: ${theme.colors.error};`;
      default:
        return `background-color: ${theme.colors.gray[500]}20; color: ${theme.colors.gray[500]};`;
    }
  }}
`;

const OrderAmount = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary};
`;

const EmptyOrders = styled.p`
  text-align: center;
  color: ${theme.colors.gray[600]};
  padding: ${theme.spacing.xl};
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusIcons = {
    pending: Clock,
    preparing: Package,
    ready: CheckCircle,
    delivered: Truck,
    cancelled: XCircle,
  };

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [statsResponse, ordersResponse, usersResponse] = await Promise.all([
        orderAPI.getStats(),
        orderAPI.getAllOrders({ limit: 5, sortBy: 'created_at', sortOrder: 'DESC' }),
        userAPI.getAll(),
      ]);

      if (statsResponse.success) {
        const data = statsResponse.data.stats;
        setStats({
          totalOrders: Number(data.total_orders) || 0,
          totalRevenue: Number(data.total_revenue) || 0,
          pendingOrders: Number(data.pending_orders) || 0,
          totalUsers: usersResponse.success
            ? (usersResponse.data.users || []).length
            : 0,
        });
      }

      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data.orders || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('en-ET', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Admin Dashboard</DashboardTitle>
        <DashboardSubtitle>
          Live overview of orders, revenue, and customers
        </DashboardSubtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard color={theme.colors.primary}>
          <CardBody>
            <StatIcon color={theme.colors.primary}>
              <ShoppingCart size={32} />
            </StatIcon>
            <StatValue>{stats.totalOrders}</StatValue>
            <StatLabel>Total Orders</StatLabel>
            <StatHint>All orders in the system</StatHint>
          </CardBody>
        </StatCard>

        <StatCard color={theme.colors.success}>
          <CardBody>
            <StatIcon color={theme.colors.success}>
              <Banknote size={32} />
            </StatIcon>
            <StatValue>{formatCurrency(stats.totalRevenue)}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
            <StatHint>From completed and active orders</StatHint>
          </CardBody>
        </StatCard>

        <StatCard color={theme.colors.info}>
          <CardBody>
            <StatIcon color={theme.colors.info}>
              <Users size={32} />
            </StatIcon>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatLabel>Total Users</StatLabel>
            <StatHint>Registered customer accounts</StatHint>
          </CardBody>
        </StatCard>

        <StatCard color={theme.colors.warning}>
          <CardBody>
            <StatIcon color={theme.colors.warning}>
              <Clock size={32} />
            </StatIcon>
            <StatValue>{stats.pendingOrders}</StatValue>
            <StatLabel>Pending Orders</StatLabel>
            <StatHint warning={stats.pendingOrders > 0}>
              <AlertCircle size={14} />
              {stats.pendingOrders > 0 ? 'Awaiting approval' : 'No pending orders'}
            </StatHint>
          </CardBody>
        </StatCard>
      </StatsGrid>

      <QuickActions>
        <ActionButton as={Link} to="/admin/orders" color={theme.colors.primary}>
          <ShoppingCart size={20} />
          Manage Orders
        </ActionButton>
        <ActionButton as={Link} to="/admin/food" color={theme.colors.success}>
          <Utensils size={20} />
          Manage Menu
        </ActionButton>
        <ActionButton as={Link} to="/admin/users" color={theme.colors.info}>
          <Users size={20} />
          Manage Users
        </ActionButton>
      </QuickActions>

      <RecentOrdersCard>
        <CardBody>
          <CardTitle>Recent Orders</CardTitle>
          {recentOrders.length === 0 ? (
            <EmptyOrders>No orders yet. Orders will appear here once customers place them.</EmptyOrders>
          ) : (
            <OrderList>
              {recentOrders.map((order) => {
                const StatusIcon = statusIcons[order.status] || Clock;
                return (
                  <OrderItem key={order.id}>
                    <OrderInfo>
                      <OrderNumber>Order #{order.id}</OrderNumber>
                      <OrderCustomer>
                        {order.username || 'Guest'} · {formatDate(order.created_at)}
                      </OrderCustomer>
                    </OrderInfo>
                    <OrderMeta>
                      <OrderStatus status={order.status}>
                        <StatusIcon size={14} />
                        {formatOrderStatus(order.status)}
                      </OrderStatus>
                      <OrderAmount>{formatCurrency(order.total_amount)}</OrderAmount>
                    </OrderMeta>
                  </OrderItem>
                );
              })}
            </OrderList>
          )}
          <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
            <Button as={Link} to="/admin/orders" variant="outline">
              View All Orders
            </Button>
          </div>
        </CardBody>
      </RecentOrdersCard>
    </DashboardContainer>
  );
};

export default AdminDashboard;
