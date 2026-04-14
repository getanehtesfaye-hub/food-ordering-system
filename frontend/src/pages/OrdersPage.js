import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Package,
  Eye
} from 'lucide-react';
import Button from '../components/UI/Button';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import theme from '../styles/theme';
import { orderAPI } from '../services/api';

const OrdersContainer = styled.div`
  min-height: calc(100vh - 140px);
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const OrdersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  gap: ${theme.spacing.lg};
`;

const OrdersTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterTab = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop)
})`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 2px solid ${props => props.active ? theme.colors.primary : theme.colors.gray[300]};
  background-color: ${props => props.active ? theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : theme.colors.gray[700]};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};
`;

const OrderCard = styled(Card)`
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const OrderDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.sm};
`;

const StatusIcon = styled.div`
  color: ${props => {
    const statusColors = {
      pending: theme.colors.warning,
      confirmed: theme.colors.info,
      preparing: theme.colors.primary,
      ready: theme.colors.success,
      delivering: theme.colors.primary,
      delivered: theme.colors.success,
      cancelled: theme.colors.error
    };
    return statusColors[props.status] || theme.colors.gray[600];
  }};
`;

const OrderDetails = styled.div`
  flex: 1;
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const CustomerName = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
`;

const OrderAmount = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary};
`;

const OrderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const ActionButton = styled(Button)`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.xs};
`;

const EmptyOrders = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.lg};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.gray[600]};
`;

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Clock,
  ready: CheckCircle,
  delivering: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const filters = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'delivering', label: 'Delivering' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        console.log('Loading orders...');
        const response = await orderAPI.getUserOrders();
        console.log('Orders response:', response);
        
        if (response.success) {
          console.log('Orders data:', response.data);
          setOrders(response.data?.orders || []);
          console.log('Orders set:', response.data?.orders);
        } else {
          console.error('Failed to load orders:', response.message);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeFilter));
    }
  }, [activeFilter, orders]);

  if (loading) {
    return (
      <OrdersContainer>
        <LoadingSpinner />
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <OrdersHeader>
        <OrdersTitle>
          <ShoppingBag size={32} />
          My Orders
        </OrdersTitle>
        <Button onClick={() => navigate('/menu')}>
          Order More Food
        </Button>
      </OrdersHeader>
      
      <FilterTabs>
        {filters.map(filter => (
          <FilterTab
            key={filter.key}
            active={activeFilter === filter.key}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </FilterTab>
        ))}
      </FilterTabs>
      
      <OrdersGrid>
        {filteredOrders && filteredOrders.map(order => {
          const StatusIcon = statusIcons[order.status] || Clock;
          return (
            <OrderCard key={order.id}>
              <CardBody>
                <OrderHeader>
                  <OrderInfo>
                    <OrderNumber>Order #{order.id}</OrderNumber>
                    <OrderDate>
                      <Calendar size={16} />
                      {formatDate(order.created_at)}
                    </OrderDate>
                  </OrderInfo>
                  <StatusIcon status={order.status} />
                </OrderHeader>
                <OrderDetails>
                  <CustomerInfo>
                    <CustomerName>{order.username || 'Guest'}</CustomerName>
                    <OrderAmount>${parseFloat(order.total_amount).toFixed(2)}</OrderAmount>
                  </CustomerInfo>
                </OrderDetails>
                <OrderActions>
                  <ActionButton as={Link} to={`/orders/${order.id}`}>
                    <Eye size={16} />
                    View Details
                  </ActionButton>
                </OrderActions>
              </CardBody>
            </OrderCard>
          );
        })}
      </OrdersGrid>
      
      {!loading && filteredOrders.length === 0 && (
        <EmptyOrders>
          <EmptyMessage>
            <ShoppingBag size={48} />
            <p>No orders found</p>
            <p>Start by adding some delicious items to your cart!</p>
          </EmptyMessage>
          <Button as={Link} to="/menu" size="lg">
            Browse Menu
          </Button>
        </EmptyOrders>
      )}
    </OrdersContainer>
  );
};

export default OrdersPage;
