import styled from 'styled-components';
import theme from '../../styles/theme';

const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => !['error', 'variant', 'size', 'fullWidth', 'textAlign'].includes(prop)
})`
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.white};
  color: ${theme.colors.gray[900]};
  transition: all ${theme.transitions.normal};
  outline: none;
  width: 100%;
  box-sizing: border-box;
  height: 42px;
  line-height: 1.5;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(26, 54, 93, 0.1);
  }

  &:hover:not(:focus) {
    border-color: ${theme.colors.gray[400]};
  }

  &:disabled {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
    border-color: ${theme.colors.gray[200]};
  }

  &::placeholder {
    color: ${theme.colors.gray[400]};
  }

  /* Error state */
  ${(props) =>
    props.error &&
    `
      border-color: ${theme.colors.error};
      
      &:focus {
        border-color: ${theme.colors.error};
        box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
      }
    `}

  /* Sizes */
  ${(props) => {
    switch (props.size) {
      case 'small':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.sm};
          height: 36px;
        `;
      case 'large':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.lg};
          height: 48px;
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.md};
          height: 42px;
        `;
    }
  }}

  /* Variants */
  ${(props) => {
    switch (props.variant) {
      case 'filled':
        return `
          background-color: ${theme.colors.gray[100]};
          border-color: transparent;
          
          &:focus {
            background-color: ${theme.colors.white};
            border-color: ${theme.colors.primary};
          }
        `;
      case 'underline':
        return `
          border: none;
          border-bottom: 2px solid ${theme.colors.gray[300]};
          border-radius: 0;
          padding-left: 0;
          padding-right: 0;
          height: auto;
          
          &:focus {
            border-bottom-color: ${theme.colors.primary};
            box-shadow: none;
          }
        `;
      default:
        return '';
    }
  }}

  /* Full width */
  ${(props) =>
    props.fullWidth &&
    `
      width: 100%;
    `}

  /* Text alignment */
  ${(props) =>
    props.textAlign &&
    `
      text-align: ${props.textAlign};
    `}
`;

export default Input;
