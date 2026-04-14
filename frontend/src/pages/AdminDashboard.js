import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Utensils,
  Package,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Button from '../components/UI/Button';
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
    background: linear-gradient(90deg, ${props => props.color} 0%, ${props => props.color} 100%);
  }
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.lg};
  background-color: ${props => props.color}20;
  color: ${props => props.color};
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
  margin-bottom: ${theme.spacing.md};
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${props => props.positive ? `
    color: ${theme.colors.success};
  ` : `
    color: ${theme.colors.error};
  `}
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(Card)`
  height: 400px;
`;

const RecentOrdersCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
`;

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
  transition: background-color ${theme.transitions.fast};
  
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
`;

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'confirmed':
        return `
          background-color: ${theme.colors.info}20;
          color: ${theme.colors.info};
        `;
      case 'preparing':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'ready':
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'delivering':
        return `
          background-color: ${theme.colors.primaryLight}20;
          color: ${theme.colors.primaryLight};
        `;
      case 'delivered':
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'cancelled':
        return `
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      default:
        return `
          background-color: ${theme.colors.gray[500]}20;
          color: ${theme.colors.gray[500]};
        `;
    }
  }}
`;

const OrderAmount = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  text-decoration: none;
  color: ${theme.colors.white};
  background: linear-gradient(135deg, ${props => props.color} 0%, ${props => props.color}dd 100%);
  
  &:hover {
    background: linear-gradient(135deg, ${props => props.color}dd 0%, ${props => props.color} 100%);
  }
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.gray[500]};
  font-size: ${theme.typography.fontSize.lg};
  border: 2px dashed ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.lg};
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    todayOrders: 0,
    todayRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockStats = {
      totalOrders: 1247,
      totalRevenue: 45678.90,
      totalCustomers: 892,
      pendingOrders: 23,
      todayOrders: 45,
      todayRevenue: 1234.56
    };

    const mockRecentOrders = [
      {
        id: 'ORD-001',
        customer: 'John Doe',
        status: 'preparing',
        amount: 45.99,
        time: '2 mins ago'
      },
      {
        id: 'ORD-002',
        customer: 'Jane Smith',
        status: 'pending',
        amount: 32.50,
        time: '5 mins ago'
      },
      {
        id: 'ORD-003',
        customer: 'Bob Johnson',
        status: 'delivering',
        amount: 67.25,
        time: '12 mins ago'
      },
      {
        id: 'ORD-004',
        customer: 'Alice Brown',
        status: 'delivered',
        amount: 28.75,
        time: '25 mins ago'
      },
      {
        id: 'ORD-005',
        customer: 'Charlie Wilson',
        status: 'confirmed',
        amount: 51.00,
        time: '30 mins ago'
      }
    ];

    setTimeout(() => {
      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    preparing: Clock,
    ready: CheckCircle,
    delivering: Package,
    delivered: CheckCircle,
    cancelled: XCircle
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
          Loading dashboard...
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Admin Dashboard</DashboardTitle>
        <DashboardSubtitle>
          Manage your restaurant operations and track performance
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
            <StatChange positive>
              <ArrowUp size={16} />
              +12% from last month
            </StatChange>
          </CardBody>
        </StatCard>

        <StatCard color={theme.colors.success}>
          <CardBody>
            <StatIcon color={theme.colors.success}>
              <DollarSign size={32} />
            </StatIcon>
            <StatValue>{formatCurrency(stats.totalRevenue)}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
            <StatChange positive>
              <ArrowUp size={16} />
              +8% from last month
            </StatChange>
          </CardBody>
        </StatCard>

        <StatCard color={theme.colors.info}>
          <CardBody>
            <StatIcon color={theme.colors.info}>
              <Users size={32} />
            </StatIcon>
            <StatValue>{stats.totalCustomers}</StatValue>
            <StatLabel>Total Customers</StatLabel>
            <StatChange positive>
              <ArrowUp size={16} />
              +15% from last month
            </StatChange>
          </CardBody>
        </StatCard>

        <StatCard color={theme.colors.warning}>
          <CardBody>
            <StatIcon color={theme.colors.warning}>
              <Clock size={32} />
            </StatIcon>
            <StatValue>{stats.pendingOrders}</StatValue>
            <StatLabel>Pending Orders</StatLabel>
            <StatChange>
              <AlertCircle size={16} />
              Needs attention
            </StatChange>
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

      <ChartsGrid>
        <ChartCard>
          <CardBody>
            <CardTitle>Revenue Overview</CardTitle>
            <ChartPlaceholder>
              <BarChart3 size={48} />
              <span style={{ marginLeft: theme.spacing.md }}>Revenue Chart</span>
            </ChartPlaceholder>
          </CardBody>
        </ChartCard>

        <ChartCard>
          <CardBody>
            <CardTitle>Order Status Distribution</CardTitle>
            <ChartPlaceholder>
              <TrendingUp size={48} />
              <span style={{ marginLeft: theme.spacing.md }}>Status Chart</span>
            </ChartPlaceholder>
          </CardBody>
        </ChartCard>
      </ChartsGrid>

      <RecentOrdersCard>
        <CardBody>
          <CardTitle>Recent Orders</CardTitle>
          <OrderList>
            {recentOrders.map(order => {
              const StatusIcon = statusIcons[order.status] || Clock;
              return (
                <OrderItem key={order.id}>
                  <OrderInfo>
                    <OrderNumber>{order.id}</OrderNumber>
                    <OrderCustomer>{order.customer}</OrderCustomer>
                  </OrderInfo>
                  <OrderMeta>
                    <OrderStatus status={order.status}>
                      <StatusIcon size={14} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </OrderStatus>
                    <OrderAmount>{formatCurrency(order.amount)}</OrderAmount>
                  </OrderMeta>
                </OrderItem>
              );
            })}
          </OrderList>
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
