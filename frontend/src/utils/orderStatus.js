export const ORDER_STATUSES = {
  pending: {
    label: 'Pending',
    description: 'Order received — awaiting review',
  },
  preparing: {
    label: 'Preparing',
    description: 'Kitchen is preparing this order',
  },
  ready: {
    label: 'Ready',
    description: 'Order is ready for pickup or delivery',
  },
  delivered: {
    label: 'Delivered',
    description: 'Order completed successfully',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Order was cancelled',
  },
};

export const ORDER_STATUS_LIST = Object.keys(ORDER_STATUSES);

export const formatOrderStatus = (status) =>
  ORDER_STATUSES[status]?.label ||
  status?.charAt(0).toUpperCase() + status?.slice(1) ||
  'Unknown';
