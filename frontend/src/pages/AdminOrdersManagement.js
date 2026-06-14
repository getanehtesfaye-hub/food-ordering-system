import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  Package,
  RefreshCw
} from 'lucide-react';
import { orderAPI } from '../services/api';
import { ORDER_STATUSES, ORDER_STATUS_LIST, formatOrderStatus } from '../utils/orderStatus';
import { formatCurrency } from '../utils/currency';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import theme from '../styles/theme';

const OrdersManagementContainer = styled.div`
  min-height: calc(100vh - 140px);
  padding: ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const ManagementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${theme.spacing.lg};
`;

const HeaderTitle = styled.div`
  flex: 1;
`;

const ManagementTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const ManagementSubtitle = styled.p`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.md};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const SearchFilterSection = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.gray[400]};
  pointer-events: none;
`;

const SearchInput = styled(Input)`
  padding-left: ${theme.spacing.xl};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const StatusFilter = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.md};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
  }
`;

const DateFilter = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.md};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
  }
`;

const OrdersTable = styled(Card)`
  overflow: hidden;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${theme.colors.gray[50]};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${theme.colors.gray[50]};
  }
  
  &:hover {
    background-color: ${theme.colors.gray[100]};
  }
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  text-align: left;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  font-size: ${theme.typography.fontSize.sm};
`;

const TableHeaderCell = styled.th`
  padding: ${theme.spacing.md};
  text-align: left;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[700]};
  border-bottom: 2px solid ${theme.colors.gray[200]};
  font-size: ${theme.typography.fontSize.sm};
`;

const OrderNumber = styled(Link)`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const CustomerName = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
`;

const CustomerContact = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray[600]};
`;

const OrderStatus = styled.div.withConfig({
  shouldForwardProp: (prop) => !['status'].includes(prop)
})`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  white-space: nowrap;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
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

const OrderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const ActionButton = styled(Button)`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.xs};
`;

const StatusModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(Card)`
  max-width: 500px;
  width: 90%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.gray[500]};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.gray[700]};
  }
`;

const StatusOptions = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
`;

const StatusOption = styled.label.withConfig({
  shouldForwardProp: (prop) => !['selected'].includes(prop)
})`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  border: 2px solid ${props => props.selected ? theme.colors.primary : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const RadioInput = styled.input`
  display: none;
`;

const StatusInfo = styled.div`
  flex: 1;
`;

const StatusTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xs};
`;

const StatusDescription = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.lg};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.lg};
`;

const ConfirmText = styled.p`
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.6;
`;

const ApproveButton = styled(Button)`
  background-color: ${theme.colors.success};
  border-color: ${theme.colors.success};

  &:hover:not(:disabled) {
    background-color: #157347;
    border-color: #157347;
  }
`;

const CancelOrderButton = styled(Button)`
  color: ${theme.colors.error};
  border-color: ${theme.colors.error};

  &:hover:not(:disabled) {
    background-color: ${theme.colors.error};
    color: ${theme.colors.white};
  }
`;

const AdminOrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const statuses = [
    { value: 'all', label: 'All Status' },
    ...ORDER_STATUS_LIST.map((value) => ({
      value,
      label: ORDER_STATUSES[value].label,
    })),
  ];

  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const statusOptions = ORDER_STATUS_LIST.map((value) => ({
    value,
    label: ORDER_STATUSES[value].label,
    description: ORDER_STATUSES[value].description,
  }));

  const statusIcons = {
    pending: Clock,
    preparing: Package,
    ready: CheckCircle,
    delivered: Truck,
    cancelled: XCircle,
  };

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders();

      if (response.success) {
        setOrders(response.data?.orders || []);
      } else {
        toast.error(response.message || 'Failed to load orders');
        setOrders([]);
      }
    } catch (error) {
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm.toLowerCase()) ||
        (order.username && order.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Apply date filter
    if (selectedDate !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        
        switch (selectedDate) {
          case 'today':
            return orderDate >= today;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return orderDate >= yesterday && orderDate < today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  }, [searchTerm, selectedStatus, selectedDate, orders]);

  const updateOrderInList = (orderId, updates) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, ...updates } : order))
    );
  };

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleStatusChange = (status) => {
    setNewStatus(status);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.status) {
      setShowStatusModal(false);
      return;
    }

    try {
      setUpdatingOrderId(selectedOrder.id);
      const response = await orderAPI.updateStatus(selectedOrder.id, newStatus);

      if (response.success) {
        updateOrderInList(selectedOrder.id, { status: newStatus });
        toast.success(`Order #${selectedOrder.id} marked as ${formatOrderStatus(newStatus)}`);
        setShowStatusModal(false);
        setSelectedOrder(null);
        setNewStatus('');
      } else {
        toast.error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleApproveOrder = (order) => {
    setSelectedOrder(order);
    setConfirmAction({
      type: 'approve',
      title: 'Approve Order',
      message: `Approve order #${order.id} and send it to the kitchen?`,
      confirmLabel: 'Approve Order',
    });
    setShowConfirmModal(true);
  };

  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setConfirmAction({
      type: 'cancel',
      title: 'Cancel Order',
      message: `Are you sure you want to cancel order #${order.id}? This cannot be undone.`,
      confirmLabel: 'Cancel Order',
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedOrder || !confirmAction) return;

    try {
      setUpdatingOrderId(selectedOrder.id);

      if (confirmAction.type === 'approve') {
        const response = await orderAPI.updateStatus(selectedOrder.id, 'preparing');
        if (response.success) {
          updateOrderInList(selectedOrder.id, { status: 'preparing' });
          toast.success(`Order #${selectedOrder.id} approved and sent to kitchen`);
        } else {
          toast.error(response.message || 'Failed to approve order');
        }
      }

      if (confirmAction.type === 'cancel') {
        const response = await orderAPI.cancelOrder(selectedOrder.id);
        if (response.success) {
          updateOrderInList(selectedOrder.id, { status: 'cancelled' });
          toast.success(`Order #${selectedOrder.id} has been cancelled`);
        } else {
          toast.error(response.message || 'Failed to cancel order');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setUpdatingOrderId(null);
      setShowConfirmModal(false);
      setConfirmAction(null);
      setSelectedOrder(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <OrdersManagementContainer>
        <LoadingMessage>Loading orders...</LoadingMessage>
      </OrdersManagementContainer>
    );
  }

  return (
    <OrdersManagementContainer>
      <ManagementHeader>
        <HeaderTitle>
          <ManagementTitle>Orders Management</ManagementTitle>
          <ManagementSubtitle>Manage and track all customer orders</ManagementSubtitle>
        </HeaderTitle>
        <HeaderActions>
          <Button onClick={loadOrders} disabled={loading}>
            <RefreshCw size={20} />
            Refresh
          </Button>
        </HeaderActions>
      </ManagementHeader>

      <SearchFilterSection>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterContainer>
          <Filter size={20} style={{ color: theme.colors.gray[500] }} />
          <StatusFilter
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </StatusFilter>
          
          <DateFilter
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {dateFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </DateFilter>
        </FilterContainer>
      </SearchFilterSection>

      <OrdersTable>
        <CardBody style={{ padding: 0 }}>
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Order #</TableHeaderCell>
                  <TableHeaderCell>Customer</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {filteredOrders && filteredOrders.map(order => {
                  const StatusIcon = statusIcons[order.status] || Clock;
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <OrderNumber to={`/orders/${order.id}`}>
                          #{order.id}
                        </OrderNumber>
                      </TableCell>
                      <TableCell>
                        <CustomerInfo>
                          <CustomerName>{order.username || 'Unknown'}</CustomerName>
                          <CustomerContact>{order.email || 'No email'}</CustomerContact>
                          <CustomerContact>{order.phone || 'No phone'}</CustomerContact>
                        </CustomerInfo>
                      </TableCell>
                      <TableCell>
                        <OrderStatus status={order.status}>
                          <StatusIcon size={14} />
                          {formatOrderStatus(order.status)}
                        </OrderStatus>
                      </TableCell>
                      <TableCell>
                        <OrderAmount>{formatCurrency(order.total_amount)}</OrderAmount>
                      </TableCell>
                      <TableCell>
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell>
                        <OrderActions>
                          <ActionButton variant="outline" as={Link} to={`/orders/${order.id}`}>
                            <Eye size={14} />
                          </ActionButton>
                          {order.status === 'pending' && (
                            <ApproveButton
                              size="small"
                              onClick={() => handleApproveOrder(order)}
                              disabled={updatingOrderId === order.id}
                            >
                              <CheckCircle size={14} />
                              Approve
                            </ApproveButton>
                          )}
                          {['pending', 'preparing'].includes(order.status) && (
                            <CancelOrderButton
                              size="small"
                              variant="outline"
                              onClick={() => handleCancelOrder(order)}
                              disabled={updatingOrderId === order.id}
                            >
                              <XCircle size={14} />
                              Cancel
                            </CancelOrderButton>
                          )}
                          <ActionButton
                            variant="outline"
                            onClick={() => handleStatusUpdate(order)}
                            disabled={updatingOrderId === order.id}
                          >
                            <Edit2 size={14} />
                          </ActionButton>
                        </OrderActions>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </OrdersTable>

      {filteredOrders.length === 0 && (
        <EmptyMessage>
          No orders found matching your criteria.
        </EmptyMessage>
      )}

      {showStatusModal && selectedOrder && (
        <StatusModal>
          <ModalContent>
            <CardBody>
              <ModalHeader>
                <ModalTitle>Update Order Status</ModalTitle>
                <CloseButton onClick={() => setShowStatusModal(false)}>
                  ×
                </CloseButton>
              </ModalHeader>
              
              <div style={{ marginBottom: theme.spacing.lg }}>
                <p><strong>Order:</strong> #{selectedOrder.id}</p>
                <p><strong>Customer:</strong> {selectedOrder.username || 'Unknown'}</p>
                <p><strong>Current Status:</strong> {formatOrderStatus(selectedOrder.status)}</p>
              </div>
              
              <StatusOptions>
                {statusOptions.map(option => {
                  const OptionIcon = statusIcons[option.value] || Clock;
                  return (
                    <StatusOption
                      key={option.value}
                      selected={newStatus === option.value}
                      onClick={() => handleStatusChange(option.value)}
                    >
                      <RadioInput
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={newStatus === option.value}
                        onChange={() => handleStatusChange(option.value)}
                      />
                      <OptionIcon size={20} />
                      <StatusInfo>
                        <StatusTitle>{option.label}</StatusTitle>
                        <StatusDescription>{option.description}</StatusDescription>
                      </StatusInfo>
                    </StatusOption>
                  );
                })}
              </StatusOptions>
              
              <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.xl }}>
                <Button onClick={handleSaveStatus} disabled={updatingOrderId === selectedOrder.id}>
                  {updatingOrderId === selectedOrder.id ? 'Updating...' : 'Update Status'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                  disabled={updatingOrderId === selectedOrder.id}
                >
                  Close
                </Button>
              </div>
            </CardBody>
          </ModalContent>
        </StatusModal>
      )}

      {showConfirmModal && selectedOrder && confirmAction && (
        <StatusModal>
          <ModalContent>
            <CardBody>
              <ModalHeader>
                <ModalTitle>{confirmAction.title}</ModalTitle>
                <CloseButton onClick={() => setShowConfirmModal(false)}>×</CloseButton>
              </ModalHeader>

              <ConfirmText>{confirmAction.message}</ConfirmText>

              <div style={{ display: 'flex', gap: theme.spacing.md }}>
                {confirmAction.type === 'approve' ? (
                  <ApproveButton
                    onClick={handleConfirmAction}
                    disabled={updatingOrderId === selectedOrder.id}
                  >
                    {confirmAction.confirmLabel}
                  </ApproveButton>
                ) : (
                  <CancelOrderButton
                    onClick={handleConfirmAction}
                    disabled={updatingOrderId === selectedOrder.id}
                  >
                    {confirmAction.confirmLabel}
                  </CancelOrderButton>
                )}
                <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                  Go Back
                </Button>
              </div>
            </CardBody>
          </ModalContent>
        </StatusModal>
      )}
    </OrdersManagementContainer>
  );
};

export default AdminOrdersManagement;
