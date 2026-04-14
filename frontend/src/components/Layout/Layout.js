import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import theme from '../../styles/theme';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.gray[50]};
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing.xl} 0;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
