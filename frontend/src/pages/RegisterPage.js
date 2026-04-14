import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChefHat, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Card, CardHeader, CardBody, CardTitle } from '../components/UI/Card';
import theme from '../styles/theme';

const RegisterContainer = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
`;

const RegisterCard = styled(Card)`
  max-width: 450px;
  width: 100%;
  text-align: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.gray[400]};
  pointer-events: none;
`;

const StyledInput = styled(Input)`
  padding-left: calc(${theme.spacing.md} + 24px); /* Icon space + extra padding */
  
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(26, 54, 93, 0.1);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.colors.gray[400]};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing.sm};
`;

const SuccessMessage = styled.div`
  color: ${theme.colors.success};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing.sm};
`;

const PasswordRequirements = styled.div`
  text-align: left;
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray[500]};
  margin-top: ${theme.spacing.xs};
  line-height: 1.4;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin: ${theme.spacing.lg} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${theme.colors.gray[300]};
  }
  
  span {
    color: ${theme.colors.gray[500]};
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const LoginLink = styled(Link)`
  color: ${theme.colors.primary};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  
  &:hover {
    color: ${theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Username must be less than 50 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Address must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <CardBody noPadding>
          <Logo>
            <ChefHat size={32} />
            FoodOrder
          </Logo>
          
          <CardTitle>Create Account</CardTitle>
          <p style={{ color: theme.colors.gray[600], marginBottom: theme.spacing.xl }}>
            Join us and start ordering your favorite food today!
          </p>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <StyledInput
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                disabled={isLoading}
              />
            </InputGroup>
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}

            <InputGroup>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <StyledInput
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={isLoading}
              />
            </InputGroup>
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

            <InputGroup>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <StyledInput
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                disabled={isLoading}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputGroup>
            {errors.password && (
              <>
                <ErrorMessage>{errors.password}</ErrorMessage>
                <PasswordRequirements>
                  Password must be at least 6 characters long
                </PasswordRequirements>
              </>
            )}

            <InputGroup>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <StyledInput
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                disabled={isLoading}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputGroup>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}

            <InputGroup>
              <InputIcon>
                <Phone size={20} />
              </InputIcon>
              <StyledInput
                type="tel"
                name="phone"
                placeholder="Phone number (optional)"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                disabled={isLoading}
              />
            </InputGroup>
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}

            <InputGroup>
              <InputIcon>
                <MapPin size={20} />
              </InputIcon>
              <StyledInput
                type="text"
                name="address"
                placeholder="Delivery address (optional)"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                disabled={isLoading}
              />
            </InputGroup>
            {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}

            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Form>

          <Divider>
            <span>OR</span>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: theme.colors.gray[600], marginBottom: theme.spacing.sm }}>
              Already have an account?
            </p>
            <LoginLink to="/login">
              Sign in instead
            </LoginLink>
          </div>
        </CardBody>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage;
