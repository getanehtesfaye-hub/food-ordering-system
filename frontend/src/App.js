import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StyleSheetManager } from 'styled-components';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminFoodManagement from './pages/AdminFoodManagement';
import AdminOrdersManagement from './pages/AdminOrdersManagement';
import AdminUsersManagement from './pages/AdminUsersManagement';
import OrderDetailPage from './pages/OrderDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import LoadingSpinner from './components/UI/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== 'active' && prop !== 'completed'}>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/login" />} />
          <Route path="/orders/:id" element={user ? <OrderDetailPage /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/food" 
            element={user?.role === 'admin' ? <AdminFoodManagement /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/orders" 
            element={user?.role === 'admin' ? <AdminOrdersManagement /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/users" 
            element={user?.role === 'admin' ? <AdminUsersManagement /> : <Navigate to="/" />} 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </StyleSheetManager>
  );
}

export default App;
