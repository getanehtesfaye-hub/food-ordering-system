export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;

  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/** Free delivery when subtotal is at or above this amount (ETB) */
export const FREE_DELIVERY_THRESHOLD = 2000;

/** Standard delivery fee in ETB */
export const DELIVERY_FEE = 150;

/** Tax rate applied at checkout */
export const TAX_RATE = 0.15;

export const calculateTax = (subtotal) => subtotal * TAX_RATE;

export const calculateDeliveryFee = (subtotal, isDelivery) =>
  isDelivery && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
