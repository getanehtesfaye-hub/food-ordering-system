import styled from 'styled-components';
import theme from '../../styles/theme';

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'fullWidth', 'noPadding', 'loading'].includes(prop)
})`
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border: 2px solid transparent;
  text-decoration: none;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Variants */
  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
            border-color: ${theme.colors.primaryDark};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.white};
          border-color: ${theme.colors.secondary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondaryDark};
            border-color: ${theme.colors.secondaryDark};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.white};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'outline-dark':
        return `
          background-color: transparent;
          color: ${theme.colors.secondary};
          border-color: ${theme.colors.secondary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary};
            color: ${theme.colors.white};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'ghost':
        return `
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: transparent;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[100]};
            color: ${theme.colors.primaryDark};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.gray[200]};
          }
        `;

      case 'danger':
        return `
          background-color: ${theme.colors.error};
          color: ${theme.colors.white};
          border-color: ${theme.colors.error};

          &:hover:not(:disabled) {
            background-color: #c82333;
            border-color: #c82333;
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      case 'success':
        return `
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
          border-color: ${theme.colors.success};

          &:hover:not(:disabled) {
            background-color: #218838;
            border-color: #218838;
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;

      default:
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
            border-color: ${theme.colors.primaryDark};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
    }
  }}

  /* Sizes */
  ${(props) => {
    switch (props.size) {
      case 'small':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
        `;
      case 'large':
        return `
          padding: ${theme.spacing.lg} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
        `;
      default:
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.md};
        `;
    }
  }}

  /* Full width */
  ${(props) =>
    props.fullWidth &&
    `
      width: 100%;
      justify-content: center;
    `}

  /* Loading state */
  ${(props) =>
    props.loading &&
    `
      color: transparent;
      pointer-events: none;
      
      &::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        border: 2px solid ${theme.colors.white};
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.8s linear infinite;
      }
    `}

  /* Icon only */
  ${(props) =>
    props.iconOnly &&
    `
      padding: ${theme.spacing.sm};
      width: auto;
      min-width: 40px;
      height: 40px;
    `}

  /* Rounded */
  ${(props) =>
    props.rounded &&
    `
      border-radius: 50px;
    `}

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  type: 'button',
};

export default Button;
