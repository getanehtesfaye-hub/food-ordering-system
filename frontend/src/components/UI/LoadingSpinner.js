import React from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';

const LoadingSpinner = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  /* Size variants */
  ${(props) => {
    switch (props.size) {
      case 'small':
        return `
          width: 20px;
          height: 20px;
        `;
      case 'medium':
        return `
          width: 40px;
          height: 40px;
        `;
      case 'large':
        return `
          width: 60px;
          height: 60px;
        `;
      default:
        return `
          width: 40px;
          height: 40px;
        `;
    }
  }}

  /* Simple spinner */
  border: ${props => props.size === 'small' ? '2px' : props.size === 'large' ? '4px' : '3px'} solid rgba(26, 54, 93, 0.2);
  border-top-color: ${props => props.color || theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  /* Centered container */
  ${(props) =>
    props.centered &&
    `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
    `}

  /* Full screen overlay */
  ${(props) =>
    props.fullScreen &&
    `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `}

  /* Inline text */
  ${(props) =>
    props.inline &&
    `
      display: inline-flex;
      vertical-align: middle;
      margin-right: 8px;
    `}
`;

// Add keyframes to document
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

LoadingSpinner.defaultProps = {
  size: 'medium',
  type: 'spinner',
};

export default LoadingSpinner;
