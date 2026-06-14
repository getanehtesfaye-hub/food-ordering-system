import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, CreditCard, MapPin, Clock, Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Button from '../components/UI/Button';
import FormField from '../components/UI/FormField';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import { formatCurrency, calculateTax, calculateDeliveryFee } from '../utils/currency';
import theme from '../styles/theme';

const CheckoutContainer = styled.div`
  min-height: calc(100vh - 140px);
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const CheckoutHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const CheckoutTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
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

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutSteps = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.lg};
`;

const Step = styled.div.withConfig({
  shouldForwardProp: (prop) => !['active', 'completed'].includes(prop)
})`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  flex: 1;
  
  &:not(:last-child) {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      right: -${theme.spacing.lg};
      top: 50%;
      transform: translateY(-50%);
      width: ${theme.spacing.lg};
      height: 2px;
      background-color: ${props => props.completed ? theme.colors.success : theme.colors.gray[300]};
    }
  }
`;

const StepIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.active ? theme.colors.primary : props.completed ? theme.colors.success : theme.colors.gray[300]};
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
`;

const StepText = styled.div.withConfig({
  shouldForwardProp: (prop) => !['active', 'completed'].includes(prop)
})`
  font-size: ${theme.typography.fontSize.sm};
  color: ${props => props.active ? theme.colors.primary : props.completed ? theme.colors.success : theme.colors.gray[600]};
  font-weight: ${props => props.active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
`;

const FormSection = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled(CardTitle)`
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const FormGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const DeliveryOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border: 2px solid ${props => props.selected ? theme.colors.primary : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  margin-bottom: ${theme.spacing.md};
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const RadioInput = styled.input`
  display: none;
`;

const OptionContent = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.xs};
`;

const OptionDescription = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const OptionPrice = styled.div`
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const PaymentMethod = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  border: 1px solid ${props => props.selected ? theme.colors.primary : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

const OrderSummary = styled(Card)`
  height: fit-content;
  position: sticky;
  top: ${theme.spacing.lg};
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

const PlaceOrderButton = styled(Button)`
  width: 100%;
  margin-bottom: ${theme.spacing.md};
`;

const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const CartItems = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing.xs};
`;

const ItemQuantity = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const ItemPrice = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary};
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderData, setOrderData] = useState({
    firstName: user?.username?.split(' ')[0] || '',
    lastName: user?.username?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    specialInstructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderData.phone?.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (deliveryOption === 'delivery' && !orderData.address?.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }

    setIsSubmitting(true);

    try {
      const subtotal = getTotalPrice();
      const tax = calculateTax(subtotal);
      const deliveryFee = calculateDeliveryFee(subtotal, deliveryOption === 'delivery');

      const fullAddress =
        deliveryOption === 'delivery'
          ? orderData.address.trim()
          : 'Pickup at restaurant';

      const orderPayload = {
        delivery_address: fullAddress,
        delivery_type: deliveryOption,
        payment_method: paymentMethod,
        subtotal,
        tax,
        delivery_fee: deliveryFee,
        total: subtotal + tax + deliveryFee,
        phone: orderData.phone,
        notes: orderData.specialInstructions,
        items: items.map((item) => ({
          food_item_id: item.food_id,
          quantity: item.quantity,
          price: parseFloat(item.price),
        })),
      };

      const response = await orderAPI.create(orderPayload);

      if (response.success) {
        await clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
      } else {
        toast.error(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getTotalPrice();
  const tax = calculateTax(subtotal);
  const deliveryFee = calculateDeliveryFee(subtotal, deliveryOption === 'delivery');
  const total = subtotal + tax + deliveryFee;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <CheckoutContainer>
        <CheckoutHeader>
          <BackButton to="/cart">
            <ArrowLeft size={20} />
            Back to Cart
          </BackButton>
          <CheckoutTitle>
            <CreditCard size={32} />
            Checkout
          </CheckoutTitle>
        </CheckoutHeader>
        
        <Card>
          <CardBody style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
            <h2>Your cart is empty</h2>
            <p style={{ color: theme.colors.gray[600], marginBottom: theme.spacing.xl }}>
              Add items to your cart before proceeding to checkout.
            </p>
            <Button as={Link} to="/menu" size="lg">
              Browse Menu
            </Button>
          </CardBody>
        </Card>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <BackButton to="/cart">
          <ArrowLeft size={20} />
          Back to Cart
        </BackButton>
        <CheckoutTitle>
          <CreditCard size={32} />
          Checkout
        </CheckoutTitle>
      </CheckoutHeader>

      <CheckoutSteps>
        <Step completed={currentStep >= 1} active={currentStep === 1}>
          <StepIcon active={currentStep === 1} completed={currentStep >= 1}>
            {currentStep >= 1 ? <Check size={16} /> : '1'}
          </StepIcon>
          <StepText active={currentStep === 1} completed={currentStep >= 1}>
            Delivery
          </StepText>
        </Step>
        <Step completed={currentStep >= 2} active={currentStep === 2}>
          <StepIcon active={currentStep === 2} completed={currentStep >= 2}>
            {currentStep >= 2 ? <Check size={16} /> : '2'}
          </StepIcon>
          <StepText active={currentStep === 2} completed={currentStep >= 2}>
            Payment
          </StepText>
        </Step>
        <Step completed={currentStep >= 3} active={currentStep === 3}>
          <StepIcon active={currentStep === 3} completed={currentStep >= 3}>
            {currentStep >= 3 ? <Check size={16} /> : '3'}
          </StepIcon>
          <StepText active={currentStep === 3} completed={currentStep >= 3}>
            Review
          </StepText>
        </Step>
      </CheckoutSteps>

      <CheckoutContent>
        <div>
          <FormSection>
            <CardBody>
              <SectionTitle>
                <MapPin size={20} />
                Delivery Information
              </SectionTitle>
              
              <FormGrid>
                <FormRow>
                  <FormField
                    name="firstName"
                    label="First Name"
                    placeholder="e.g. John"
                    value={orderData.firstName}
                    onChange={handleInputChange}
                  />
                  <FormField
                    name="lastName"
                    label="Last Name"
                    placeholder="e.g. Smith"
                    value={orderData.lastName}
                    onChange={handleInputChange}
                  />
                </FormRow>

                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="e.g. john.smith@email.com"
                  value={orderData.email}
                  onChange={handleInputChange}
                />

                <FormField
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="e.g. +251 911 234 567"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  required
                />

                {deliveryOption === 'delivery' && (
                  <FormField
                    name="address"
                    label="Delivery Address"
                    placeholder="e.g. Bole Road, near Edna Mall, Addis Ababa"
                    value={orderData.address}
                    onChange={handleInputChange}
                    required
                  />
                )}
              </FormGrid>
            </CardBody>
          </FormSection>

          <FormSection>
            <CardBody>
              <SectionTitle>
                <Clock size={20} />
                Delivery Options
              </SectionTitle>
              
              <DeliveryOption
                selected={deliveryOption === 'delivery'}
                onClick={() => setDeliveryOption('delivery')}
              >
                <RadioInput
                  type="radio"
                  name="delivery"
                  value="delivery"
                  checked={deliveryOption === 'delivery'}
                  onChange={() => setDeliveryOption('delivery')}
                />
                <OptionContent>
                  <OptionTitle>Home Delivery</OptionTitle>
                  <OptionDescription>Get your food delivered to your doorstep</OptionDescription>
                </OptionContent>
                <OptionPrice>
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </OptionPrice>
              </DeliveryOption>
              
              <DeliveryOption
                selected={deliveryOption === 'pickup'}
                onClick={() => setDeliveryOption('pickup')}
              >
                <RadioInput
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryOption === 'pickup'}
                  onChange={() => setDeliveryOption('pickup')}
                />
                <OptionContent>
                  <OptionTitle>Pickup</OptionTitle>
                  <OptionDescription>Collect your order from our restaurant</OptionDescription>
                </OptionContent>
                <OptionPrice>FREE</OptionPrice>
              </DeliveryOption>
            </CardBody>
          </FormSection>

          <FormSection>
            <CardBody>
              <SectionTitle>
                <CreditCard size={20} />
                Payment Method
              </SectionTitle>
              
              <FormGrid>
                <PaymentMethod
                  selected={paymentMethod === 'card'}
                  onClick={() => setPaymentMethod('card')}
                >
                  <RadioInput
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <CreditCard size={20} />
                  <span>Credit/Debit Card</span>
                </PaymentMethod>
                
                <PaymentMethod
                  selected={paymentMethod === 'cash'}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <RadioInput
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                  />
                  <span>Cash on Delivery</span>
                </PaymentMethod>
                
                {paymentMethod === 'card' && (
                  <>
                    <FormField
                      name="cardNumber"
                      label="Card Number"
                      placeholder="e.g. 1234 5678 9012 3456"
                      value={orderData.cardNumber}
                      onChange={handleInputChange}
                    />

                    <FormField
                      name="cardName"
                      label="Cardholder Name"
                      placeholder="e.g. John Smith"
                      value={orderData.cardName}
                      onChange={handleInputChange}
                    />

                    <FormRow>
                      <FormField
                        name="expiryDate"
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={orderData.expiryDate}
                        onChange={handleInputChange}
                      />
                      <FormField
                        name="cvv"
                        label="CVV"
                        placeholder="e.g. 123"
                        value={orderData.cvv}
                        onChange={handleInputChange}
                      />
                    </FormRow>
                  </>
                )}

                <FormField
                  name="specialInstructions"
                  label="Special Instructions (Optional)"
                  as="textarea"
                  rows={3}
                  value={orderData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="e.g. No onions, extra sauce, ring the doorbell..."
                />
              </FormGrid>
            </CardBody>
          </FormSection>
        </div>

        <div>
          <OrderSummary>
            <CardBody>
              <SectionTitle>Order Summary</SectionTitle>
              
              <CartItems>
                {items && items.map(item => (
                  <CartItem key={item.food_id}>
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      <ItemQuantity>{formatCurrency(item.price)} x {item.quantity}</ItemQuantity>
                    </ItemInfo>
                    <ItemPrice>{formatCurrency(parseFloat(item.price) * item.quantity)}</ItemPrice>
                  </CartItem>
                ))}
              </CartItems>
              
              <SummaryItem>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </SummaryItem>
              
              <SummaryItem>
                <span>Tax (15%)</span>
                <span>{formatCurrency(tax)}</span>
              </SummaryItem>
              
              <SummaryItem>
                <span>Delivery</span>
                <span>
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </SummaryItem>
              
              <SummaryTotal>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </SummaryTotal>
              
              <PlaceOrderButton
                type="submit"
                size="lg"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </PlaceOrderButton>
              
              <SecurityInfo>
                <Shield size={16} />
                <span>Your payment information is secure and encrypted</span>
              </SecurityInfo>
            </CardBody>
          </OrderSummary>
        </div>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default CheckoutPage;
