import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cartAPI } from '../../services/api';
import Button from '../UI/Button';

const AddToCartButton = ({ foodItem, className = '' }) => {
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    try {
      // Send correct field name that backend expects
      const response = await cartAPI.addItem(foodItem.id, 1);
      
      if (response.success) {
        // Update local cart state
        addItem({
          food_item_id: foodItem.id,  // Use food_item_id to match backend
          name: foodItem.name,
          price: parseFloat(foodItem.price),
          quantity: 1
        });
        alert('Item added to cart successfully!');
      } else {
        alert('Failed to add item to cart: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <Button 
      variant="primary" 
      onClick={handleAddToCart}
      className={className}
    >
      <ShoppingCart size={16} />
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
