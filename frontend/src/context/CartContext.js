import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  unavailableItems: 0,
};

// Action types
const CART_ACTIONS = {
  LOAD_CART_START: 'LOAD_CART_START',
  LOAD_CART_SUCCESS: 'LOAD_CART_SUCCESS',
  LOAD_CART_FAILURE: 'LOAD_CART_FAILURE',
  ADD_ITEM_START: 'ADD_ITEM_START',
  ADD_ITEM_SUCCESS: 'ADD_ITEM_SUCCESS',
  ADD_ITEM_FAILURE: 'ADD_ITEM_FAILURE',
  UPDATE_ITEM_START: 'UPDATE_ITEM_START',
  UPDATE_ITEM_SUCCESS: 'UPDATE_ITEM_SUCCESS',
  UPDATE_ITEM_FAILURE: 'UPDATE_ITEM_FAILURE',
  REMOVE_ITEM_START: 'REMOVE_ITEM_START',
  REMOVE_ITEM_SUCCESS: 'REMOVE_ITEM_SUCCESS',
  REMOVE_ITEM_FAILURE: 'REMOVE_ITEM_FAILURE',
  CLEAR_CART_START: 'CLEAR_CART_START',
  CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
  CLEAR_CART_FAILURE: 'CLEAR_CART_FAILURE',
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART_START:
    case CART_ACTIONS.ADD_ITEM_START:
    case CART_ACTIONS.UPDATE_ITEM_START:
    case CART_ACTIONS.REMOVE_ITEM_START:
    case CART_ACTIONS.CLEAR_CART_START:
      return {
        ...state,
        loading: true,
      };

    case CART_ACTIONS.LOAD_CART_SUCCESS:
    case CART_ACTIONS.ADD_ITEM_SUCCESS:
    case CART_ACTIONS.UPDATE_ITEM_SUCCESS:
    case CART_ACTIONS.REMOVE_ITEM_SUCCESS:
      return {
        ...state,
        items: action.payload.items,
        totalItems: action.payload.total_items,
        totalPrice: action.payload.total_price,
        unavailableItems: action.payload.unavailable_items || 0,
        loading: false,
      };

    case CART_ACTIONS.CLEAR_CART_SUCCESS:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        unavailableItems: 0,
        loading: false,
      };

    case CART_ACTIONS.LOAD_CART_FAILURE:
    case CART_ACTIONS.ADD_ITEM_FAILURE:
    case CART_ACTIONS.UPDATE_ITEM_FAILURE:
    case CART_ACTIONS.REMOVE_ITEM_FAILURE:
    case CART_ACTIONS.CLEAR_CART_FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart when user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCart();
    }
  }, []);

  // Load cart
  const loadCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.LOAD_CART_START });
      const response = await cartAPI.getCart();
      
      if (response.success) {
        dispatch({
          type: CART_ACTIONS.LOAD_CART_SUCCESS,
          payload: response.data,
        });
      } else {
        dispatch({ type: CART_ACTIONS.LOAD_CART_FAILURE });
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.LOAD_CART_FAILURE });
    }
  };

  // Add item to cart
  const addItem = async (foodItemId, quantity = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.ADD_ITEM_START });
      
      const response = await cartAPI.addItem(foodItemId, quantity);
      
      if (response.success) {
        // Reload the entire cart to get updated data
        await loadCart();
        toast.success('Item added to cart!');
        return { success: true };
      } else {
        dispatch({ type: CART_ACTIONS.ADD_ITEM_FAILURE });
        toast.error(response.message || 'Failed to add item to cart');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.ADD_ITEM_FAILURE });
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update item quantity
  const updateItemQuantity = async (foodItemId, quantity) => {
    try {
      dispatch({ type: CART_ACTIONS.UPDATE_ITEM_START });
      
      const response = await cartAPI.updateItem(foodItemId, quantity);
      
      if (response.success) {
        // Reload the entire cart to get updated data
        await loadCart();
        return { success: true };
      } else {
        dispatch({ type: CART_ACTIONS.UPDATE_ITEM_FAILURE });
        toast.error(response.message || 'Failed to update cart');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.UPDATE_ITEM_FAILURE });
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Remove item from cart
  const removeItem = async (foodItemId) => {
    try {
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM_START });
      
      const response = await cartAPI.removeItem(foodItemId);
      
      if (response.success) {
        // Reload the entire cart to get updated data
        await loadCart();
        toast.success('Item removed from cart');
        return { success: true };
      } else {
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM_FAILURE });
        toast.error(response.message || 'Failed to remove item');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM_FAILURE });
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.CLEAR_CART_START });
      
      const response = await cartAPI.clearCart();
      
      if (response.success) {
        dispatch({
          type: CART_ACTIONS.CLEAR_CART_SUCCESS,
          payload: response.data,
        });
        toast.success('Cart cleared');
        return { success: true };
      } else {
        dispatch({ type: CART_ACTIONS.CLEAR_CART_FAILURE });
        toast.error(response.message || 'Failed to clear cart');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.CLEAR_CART_FAILURE });
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Get cart count
  const getCartCount = () => {
    return state.totalItems;
  };

  // Check if cart is empty
  const isCartEmpty = () => {
    return state.totalItems === 0;
  };

  // Get item quantity
  const getItemQuantity = (foodItemId) => {
    if (!state.items || !Array.isArray(state.items)) {
      return 0;
    }
    const item = state.items.find(item => item.food_id === parseInt(foodItemId));
    return item ? item.quantity : 0;
  };

  // Calculate subtotal for specific items
  const calculateSubtotal = (items = state.items) => {
    if (!items || !Array.isArray(items)) {
      return 0;
    }
    return items.reduce((total, item) => {
      if (item.is_available) {
        return total + (parseFloat(item.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  // Get available items only
  const getAvailableItems = () => {
    if (!state.items || !Array.isArray(state.items)) {
      return [];
    }
    return state.items.filter(item => item.is_available);
  };

  // Validate cart for checkout
  const validateCart = () => {
    const availableItems = getAvailableItems();
    const hasUnavailableItems = state.unavailableItems > 0;
    
    return {
      isValid: !hasUnavailableItems && availableItems.length > 0,
      availableItems,
      unavailableItems: state.unavailableItems,
      message: hasUnavailableItems 
        ? 'Some items in your cart are no longer available' 
        : availableItems.length === 0 
          ? 'Your cart is empty' 
          : null
    };
  };

  // Get total price
  const getTotalPrice = () => {
    return state.totalPrice;
  };

  // Get total items
  const getTotalItems = () => {
    return state.totalItems;
  };

  const value = {
    ...state,
    loadCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    getCartCount,
    isCartEmpty,
    getItemQuantity,
    calculateSubtotal,
    getAvailableItems,
    validateCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
