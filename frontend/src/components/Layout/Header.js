import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ShoppingCart, User, Menu, X, LogOut, ChefHat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../UI/Button';
import theme from '../../styles/theme';

const HeaderContainer = styled.header`
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.white};
  padding: 0;
  box-shadow: ${theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.white};
  text-decoration: none;
  transition: all ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.primaryLight};
    transform: translateY(-1px);
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${theme.colors.white};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.normal};
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${theme.colors.white};
  }

  &.active {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
  }
`;

const CartButton = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background-color: transparent;
  color: ${theme.colors.white};
  border: 2px solid ${theme.colors.white};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.white};
    color: ${theme.colors.secondary};
  }

  .cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled(Button)`
  background-color: transparent;
  color: ${theme.colors.white};
  border: 2px solid ${theme.colors.white};
  padding: ${theme.spacing.sm} ${theme.spacing.md};

  &:hover {
    background-color: ${theme.colors.white};
    color: ${theme.colors.secondary};
  }
`;

const UserDropdown = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen'].includes(prop)
})`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  min-width: 200px;
  margin-top: ${theme.spacing.sm};
  overflow: hidden;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transform: ${(props) => (props.isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all ${theme.transitions.normal};
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  color: ${theme.colors.gray[900]};
  text-decoration: none;
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.primary};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.gray[200]};
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  color: ${theme.colors.gray[900]};
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.error};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.gray[200]};
  }
`;

const LoginButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: transparent;
  color: ${theme.colors.white};
  border: 2px solid ${theme.colors.white};
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.white};
    color: ${theme.colors.secondary};
  }
`;

const RegisterButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const MobileMenuButton = styled(Button)`
  background-color: transparent;
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.sm};

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isOpen'].includes(prop)
})`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background-color: ${theme.colors.secondary};
  padding: ${theme.spacing.lg};
  transform: ${(props) => (props.isOpen ? 'translateY(0)' : 'translateY(-100%)')};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transition: all ${theme.transitions.normal};
  z-index: 999;
  max-height: calc(100vh - 70px);
  overflow-y: auto;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  color: ${theme.colors.white};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    color: ${theme.colors.primaryLight};
  }

  &.active {
    color: ${theme.colors.primaryLight};
  }
`;

const MobileUserSection = styled.div`
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMenus = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <ChefHat size={28} />
          FoodOrder
        </Logo>

        <Navigation>
          <NavLink to="/" className={isActivePath('/') ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/menu" className={isActivePath('/menu') ? 'active' : ''}>
            Menu
          </NavLink>
          {user && (
            <NavLink to="/orders" className={isActivePath('/orders') ? 'active' : ''}>
              My Orders
            </NavLink>
          )}
          {isAdmin() && (
            <NavLink to="/admin" className={isActivePath('/admin') ? 'active' : ''}>
              Admin
            </NavLink>
          )}
        </Navigation>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          {user ? (
            <>
              <CartButton to="/cart">
                <ShoppingCart size={20} />
                Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </CartButton>

              <UserMenu>
                <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <User size={20} />
                  {user.username}
                </UserButton>
                <UserDropdown isOpen={isUserMenuOpen}>
                  <DropdownItem to="/profile">
                    <User size={16} />
                    Profile
                  </DropdownItem>
                  {isAdmin() && (
                    <DropdownItem to="/admin">
                      <ChefHat size={16} />
                      Admin Dashboard
                    </DropdownItem>
                  )}
                  <DropdownButton onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </DropdownButton>
                </UserDropdown>
              </UserMenu>
            </>
          ) : (
            <>
              <CartButton to="/cart">
                <ShoppingCart size={20} />
                Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </CartButton>
              <LoginButton to="/login">
                Login
              </LoginButton>
              <RegisterButton to="/register">
                Register
              </RegisterButton>
            </>
          )}

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </div>
      </HeaderContent>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileNavLink to="/" onClick={closeMenus}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/menu" onClick={closeMenus}>
          Menu
        </MobileNavLink>
        {user && (
          <>
            <MobileNavLink to="/orders" onClick={closeMenus}>
              My Orders
            </MobileNavLink>
            <MobileNavLink to="/cart" onClick={closeMenus}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </MobileNavLink>
            <MobileNavLink to="/profile" onClick={closeMenus}>
              Profile
            </MobileNavLink>
            {isAdmin() && (
              <MobileNavLink to="/admin" onClick={closeMenus}>
                Admin Dashboard
              </MobileNavLink>
            )}
          </>
        )}

        {!user ? (
          <>
            <MobileNavLink to="/login" onClick={closeMenus}>
              Login
            </MobileNavLink>
            <MobileNavLink to="/register" onClick={closeMenus}>
              Register
            </MobileNavLink>
          </>
        ) : (
          <MobileUserSection>
            <Button onClick={handleLogout} variant="outline-dark" fullWidth>
              <LogOut size={16} />
              Logout
            </Button>
          </MobileUserSection>
        )}
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
