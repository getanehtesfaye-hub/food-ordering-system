import React from 'react';
import styled from 'styled-components';
import { ChefHat, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import theme from '../../styles/theme';

const FooterContainer = styled.footer`
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.white};
  padding: ${theme.spacing.xxl} 0 ${theme.spacing.lg};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xl};
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing.md};
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
`;

const FooterTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.white};
  margin: 0 0 ${theme.spacing.md} 0;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  &:hover {
    color: ${theme.colors.primaryLight};
    transform: translateX(2px);
  }
`;

const ExternalLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  &:hover {
    color: ${theme.colors.primaryLight};
    transform: translateX(2px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.white};
  border-radius: 50%;
  text-decoration: none;
  transition: all ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: ${theme.spacing.xl} auto 0;
  padding: ${theme.spacing.lg} 1rem 0;
  border-top: 1px solid rgba(228, 214, 214, 0.89);
  text-align: center;
  color: rgba(205, 196, 196, 0.9);
  font-size: ${theme.typography.fontSize.sm};
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const PaymentIcon = styled.div`
  width: 40px;
  height: 25px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>
            <ChefHat size={28} />
            FoodOrder
          </FooterLogo>
          <FooterText>
            Your favorite food delivery service. We bring delicious meals right to your doorstep with just a few clicks.
          </FooterText>
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">
              <Facebook size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <Twitter size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <Instagram size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/menu">Menu</FooterLink>
          <FooterLink to="/orders">My Orders</FooterLink>
          <FooterLink to="/profile">Profile</FooterLink>
          <FooterLink to="/cart">Shopping Cart</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Contact Info</FooterTitle>
          <FooterLink href="tel:+251953942188">
            <Phone size={16} />
          +251 953 94 21 88
          </FooterLink>
          <FooterLink href="mailto:info@foodorder.com">
            <Mail size={16} />
            info@foodorder.com
          </FooterLink>
          <ExternalLink href="https://maps.google.com">
            <MapPin size={16} />
          Gotera, Addis Ababa
          </ExternalLink>
          <FooterText style={{ marginTop: theme.spacing.md }}>
            Monday - Sunday: 10:00 AM - 11:00 PM
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Payment Methods</FooterTitle>
          <FooterText>
            We accept all major payment methods for your convenience.
          </FooterText>
          <PaymentMethods>
            <PaymentIcon>BOA</PaymentIcon>
            <PaymentIcon>AMOLE</PaymentIcon>
            <PaymentIcon>CBE</PaymentIcon>
            <PaymentIcon>TELEBIRR</PaymentIcon>
            <PaymentIcon>MPESA</PaymentIcon>
          </PaymentMethods>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; 2024 FoodOrder. All rights reserved. Made with ❤️ for food lovers.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
