import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/UI/Button';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import { formatCurrency, calculateTax, calculateDeliveryFee } from '../utils/currency';
import theme from '../styles/theme';

const CartContainer = styled.div`
  min-height: calc(100vh - 140px);
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const CartHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const CartTitle = styled.h1`
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

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const CartItem = styled(Card)`
  display: flex;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
`;

const ItemImage = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, ${theme.colors.gray[200]} 0%, ${theme.colors.gray[300]} 100%);
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.gray[500]};
  font-size: 32px;
  flex-shrink: 0;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const ItemName = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.secondary};
  margin: 0;
`;

const ItemDescription = styled.p`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.sm};
  margin: 0;
  line-height: 1.4;
`;

const ItemPrice = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const ItemControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  align-items: flex-end;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background: ${theme.colors.gray[100]};
  border: none;
  padding: ${theme.spacing.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color ${theme.transitions.fast};
  
  &:hover {
    background: ${theme.colors.gray[200]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-weight: ${theme.typography.fontWeight.medium};
  min-width: 50px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.error};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  transition: color ${theme.transitions.fast};
  
  &:hover {
    color: ${theme.colors.error};
    opacity: 0.8;
  }
`;

const CartSummary = styled(Card)`
  height: fit-content;
  position: sticky;
  top: ${theme.spacing.lg};
`;

const SummaryTitle = styled(CardTitle)`
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

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-bottom: ${theme.spacing.md};
`;

const ContinueShoppingButton = styled(Link)`
  display: block;
  width: 100%;
  text-align: center;
  padding: ${theme.spacing.md};
  background: none;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.gray[600]};
  text-decoration: none;
  font-size: ${theme.typography.fontSize.md};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
  }
`;

const EmptyCart = styled(Card)`
  text-align: center;
  padding: ${theme.spacing.xxl};
`;

const EmptyCartIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing.lg};
  opacity: 0.5;
`;

const EmptyCartTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing.md};
`;

const EmptyCartMessage = styled.p`
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.xl};
`;

const CartPage = () => {
  const { items, updateItemQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();

  const handleUpdateQuantity = (itemId, change) => {
    if (!items || !Array.isArray(items)) return;
    const item = items.find(item => item.food_id === itemId);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change);
      if (newQuantity === 0) {
        removeItem(itemId);
      } else {
        updateItemQuantity(itemId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const subtotal = getTotalPrice();
  const tax = calculateTax(subtotal);
  const deliveryFee = calculateDeliveryFee(subtotal, true);
  const total = subtotal + tax + deliveryFee;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <CartContainer>
        <CartHeader>
          <BackButton to="/menu">
            <ArrowLeft size={20} />
            Back to Menu
          </BackButton>
          <CartTitle>
            <ShoppingCart size={32} />
            Your Cart
          </CartTitle>
        </CartHeader>

        <EmptyCart>
          <EmptyCartIcon>
            <ShoppingCart size={64} />
          </EmptyCartIcon>
          <EmptyCartTitle>Your cart is empty</EmptyCartTitle>
          <EmptyCartMessage>
            Looks like you haven't added anything to your cart yet. 
            Start browsing our delicious menu!
          </EmptyCartMessage>
          <Button as={Link} to="/menu" size="lg">
            Browse Menu
          </Button>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <BackButton to="/menu">
          <ArrowLeft size={20} />
          Back to Menu
        </BackButton>
        <CartTitle>
          <ShoppingCart size={32} />
          Your Cart ({getTotalItems()} items)
        </CartTitle>
      </CartHeader>

      <CartContent>
        <CartItems>
          {items.map(item => (
            <CartItem key={item.food_id}>
              <ItemImage>
                🍽️
              </ItemImage>
              
              <ItemDetails>
                <ItemName>{item.name}</ItemName>
                <ItemDescription>{item.description}</ItemDescription>
                <ItemPrice>{formatCurrency(parseFloat(item.price) * item.quantity)}</ItemPrice>
              </ItemDetails>
              
              <ItemControls>
                <QuantityControl>
                  <QuantityButton
                    onClick={() => handleUpdateQuantity(item.food_id, -1)}
                    disabled={item.quantity === 1}
                  >
                    <Minus size={16} />
                  </QuantityButton>
                  <QuantityDisplay>{item.quantity}</QuantityDisplay>
                  <QuantityButton
                    onClick={() => handleUpdateQuantity(item.food_id, 1)}
                  >
                    <Plus size={16} />
                  </QuantityButton>
                </QuantityControl>
                
                <RemoveButton onClick={() => handleRemoveItem(item.food_id)}>
                  <Trash2 size={16} />
                  Remove
                </RemoveButton>
              </ItemControls>
            </CartItem>
          ))}
        </CartItems>

        <CartSummary>
          <CardBody>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryItem>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </SummaryItem>
            
            <SummaryItem>
              <span>Tax (15%)</span>
              <span>{formatCurrency(tax)}</span>
            </SummaryItem>
            
            <SummaryItem>
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
              </span>
            </SummaryItem>
            
            <SummaryTotal>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </SummaryTotal>
            
            <CheckoutButton as={Link} to="/checkout" size="lg">
              <CreditCard size={20} style={{ marginRight: theme.spacing.sm }} />
              Proceed to Checkout
            </CheckoutButton>
            
            <ContinueShoppingButton to="/menu">
              Continue Shopping
            </ContinueShoppingButton>
          </CardBody>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default CartPage;
