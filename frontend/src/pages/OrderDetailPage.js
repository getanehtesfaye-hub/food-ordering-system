import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Clock, CheckCircle, XCircle, Truck, MapPin, Phone, User, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import Button from '../components/UI/Button';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import theme from '../styles/theme';

const OrderDetailContainer = styled.div`
  min-height: calc(100vh - 140px);
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const OrderHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.gray[600]};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.md};
  margin-bottom: ${theme.spacing.lg};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const OrderTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const OrderContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const OrderStatusCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return `
          background-color: ${theme.colors.warning};
          color: white;
        `;
      case 'confirmed':
        return `
          background-color: ${theme.colors.info};
          color: white;
        `;
      case 'preparing':
        return `
          background-color: ${theme.colors.primary};
          color: white;
        `;
      case 'ready':
        return `
          background-color: ${theme.colors.success};
          color: white;
        `;
      case 'delivering':
        return `
          background-color: ${theme.colors.primaryLight};
          color: white;
        `;
      case 'delivered':
        return `
          background-color: ${theme.colors.success};
          color: white;
        `;
      case 'cancelled':
        return `
          background-color: ${theme.colors.error};
          color: white;
        `;
      default:
        return `
          background-color: ${theme.colors.gray[500]};
          color: white;
        `;
    }
  }}
`;

const StatusTimeline = styled.div`
  position: relative;
  padding-left: ${theme.spacing.xl};
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 12px;
  top: 20px;
  bottom: 0;
  width: 2px;
  background-color: ${theme.colors.gray[300]};
`;

const TimelineItem = styled.div`
  position: relative;
  display: flex;
  align-items: start;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  
  &:last-child .timeline-line {
    display: none;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  left: -${theme.spacing.xl};
  top: ${theme.spacing.xs};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.completed ? theme.colors.success : theme.colors.gray[300]};
  border: 3px solid ${props => props.completed ? theme.colors.success : theme.colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.xs};
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xs};
  color: ${props => props.completed ? theme.colors.secondary : theme.colors.gray[500]};
`;

const TimelineTime = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const OrderItemsCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
`;

const OrderItemsGrid = styled.div`
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
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xs};
`;

const ItemQuantity = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const ItemPrice = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const OrderSummaryCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.md};
`;

const SummaryTotal = styled(SummaryItem)`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  padding-top: ${theme.spacing.md};
  border-top: 2px solid ${theme.colors.gray[200]};
  margin-bottom: ${theme.spacing.xl};
`;

const DeliveryInfoCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: start;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoIcon = styled.div`
  color: ${theme.colors.primary};
  margin-top: ${theme.spacing.xs};
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[500]};
  margin-bottom: ${theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.gray[800]};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const OrderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockOrder = {
      id: id,
      orderNumber: `ORD-${id}`,
      date: new Date('2024-01-15T14:30:00'),
      status: 'delivering',
      estimatedDelivery: new Date('2024-01-15T15:15:00'),
      items: [
        { name: 'Classic Burger', quantity: 2, price: 12.99 },
        { name: 'French Fries', quantity: 1, price: 4.99 },
        { name: 'Coca Cola', quantity: 2, price: 2.99 }
      ],
      subtotal: 35.95,
      tax: 2.88,
      deliveryFee: 4.99,
      total: 43.82,
      deliveryAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      customerInfo: {
        name: 'John Doe',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com'
      },
      specialInstructions: 'Please deliver to the front desk',
      paymentMethod: 'Credit Card',
      timeline: [
        { status: 'Order Placed', time: '2:30 PM', completed: true },
        { status: 'Order Confirmed', time: '2:35 PM', completed: true },
        { status: 'Preparing', time: '2:40 PM', completed: true },
        { status: 'Ready for Delivery', time: '2:55 PM', completed: true },
        { status: 'Out for Delivery', time: '3:00 PM', completed: true },
        { status: 'Delivered', time: 'Estimated 3:15 PM', completed: false }
      ]
    };

    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [id]);

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    preparing: Clock,
    ready: CheckCircle,
    delivering: Truck,
    delivered: CheckCircle,
    cancelled: XCircle
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const StatusIcon = statusIcons[order?.status] || Clock;

  if (loading) {
    return (
      <OrderDetailContainer>
        <div style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
          Loading order details...
        </div>
      </OrderDetailContainer>
    );
  }

  if (!order) {
    return (
      <OrderDetailContainer>
        <BackButton to="/orders">
          <ArrowLeft size={20} />
          Back to Orders
        </BackButton>
        <div style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
          <h2>Order not found</h2>
          <p style={{ color: theme.colors.gray[600] }}>
            The order you're looking for doesn't exist.
          </p>
          <Button as={Link} to="/orders" style={{ marginTop: theme.spacing.lg }}>
            View All Orders
          </Button>
        </div>
      </OrderDetailContainer>
    );
  }

  return (
    <OrderDetailContainer>
      <OrderHeader>
        <BackButton to="/orders">
          <ArrowLeft size={20} />
          Back to Orders
        </BackButton>
        <OrderTitle>Order #{order.orderNumber}</OrderTitle>
        <p style={{ color: theme.colors.gray[600] }}>
          Placed on {formatDate(order.date)}
        </p>
      </OrderHeader>

      <OrderContent>
        <div>
          <OrderStatusCard>
            <CardBody>
              <StatusHeader>
                <CardTitle>Order Status</CardTitle>
                <StatusBadge status={order.status}>
                  <StatusIcon size={20} />
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </StatusBadge>
              </StatusHeader>

              <StatusTimeline>
                <TimelineLine />
                {order.timeline.map((item, index) => (
                  <TimelineItem key={index}>
                    <TimelineDot completed={item.completed}>
                      {item.completed && <CheckCircle size={12} />}
                    </TimelineDot>
                    <TimelineContent>
                      <TimelineTitle completed={item.completed}>
                        {item.status}
                      </TimelineTitle>
                      <TimelineTime>{item.time}</TimelineTime>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </StatusTimeline>
            </CardBody>
          </OrderStatusCard>

          <OrderItemsCard>
            <CardBody>
              <CardTitle>Order Items</CardTitle>
              <OrderItemsGrid>
                {order.items.map((item, index) => (
                  <OrderItem key={index}>
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
                    </ItemInfo>
                    <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
                  </OrderItem>
                ))}
              </OrderItemsGrid>
            </CardBody>
          </OrderItemsCard>

          <OrderSummaryCard>
            <CardBody>
              <CardTitle>Order Summary</CardTitle>
              <SummaryItem>
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </SummaryItem>
              <SummaryTotal>
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </SummaryTotal>
              
              <OrderActions>
                {order.status === 'delivered' && (
                  <Button>
                    <RefreshCw size={16} style={{ marginRight: theme.spacing.sm }} />
                    Order Again
                  </Button>
                )}
                <Button variant="outline">
                  Download Receipt
                </Button>
              </OrderActions>
            </CardBody>
          </OrderSummaryCard>
        </div>

        <div>
          <DeliveryInfoCard>
            <CardBody>
              <CardTitle>Delivery Information</CardTitle>
              
              <InfoItem>
                <InfoIcon>
                  <MapPin size={20} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Delivery Address</InfoLabel>
                  <InfoValue>
                    {order.deliveryAddress.street}<br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                  </InfoValue>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon>
                  <User size={20} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Customer</InfoLabel>
                  <InfoValue>
                    {order.customerInfo.name}<br />
                    {order.customerInfo.phone}<br />
                    {order.customerInfo.email}
                  </InfoValue>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon>
                  <DollarSign size={20} />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Payment Method</InfoLabel>
                  <InfoValue>{order.paymentMethod}</InfoValue>
                </InfoContent>
              </InfoItem>
              
              {order.specialInstructions && (
                <InfoItem>
                  <InfoIcon>
                    <Calendar size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Special Instructions</InfoLabel>
                    <InfoValue>{order.specialInstructions}</InfoValue>
                  </InfoContent>
                </InfoItem>
              )}
            </CardBody>
          </DeliveryInfoCard>
        </div>
      </OrderContent>
    </OrderDetailContainer>
  );
};

export default OrderDetailPage;
