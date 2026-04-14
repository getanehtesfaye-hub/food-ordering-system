import styled from 'styled-components';
import theme from '../../styles/theme';

const Card = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'noPadding'].includes(prop)
})`
  font-family: ${theme.typography.fontFamily};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  transition: all ${theme.transitions.normal};

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }

  /* Variants */
  ${(props) => {
    switch (props.variant) {
      case 'elevated':
        return `
          box-shadow: ${theme.shadows.md};
          
          &:hover {
            box-shadow: ${theme.shadows.lg};
            transform: translateY(-4px);
          }
        `;
      case 'outlined':
        return `
          box-shadow: none;
          border: 2px solid ${theme.colors.gray[200]};
          
          &:hover {
            border-color: ${theme.colors.primary};
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case 'flat':
        return `
          box-shadow: none;
          border: 1px solid ${theme.colors.gray[200]};
          
          &:hover {
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case 'dark':
        return `
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.white};
          box-shadow: ${theme.shadows.md};
          
          &:hover {
            background-color: ${theme.colors.secondaryDark};
            box-shadow: ${theme.shadows.lg};
          }
        `;
      default:
        return '';
    }
  }}

  /* Interactive */
  ${(props) =>
    props.clickable &&
    `
      cursor: pointer;
      user-select: none;
      
      &:active {
        transform: translateY(0);
        box-shadow: ${theme.shadows.sm};
      }
    `}

  /* Sizes */
  ${(props) => {
    switch (props.size) {
      case 'small':
        return `
          padding: ${theme.spacing.md};
        `;
      case 'large':
        return `
          padding: ${theme.spacing.xl};
        `;
      default:
        return `
          padding: ${theme.spacing.lg};
        `;
    }
  }}

  /* No padding */
  ${(props) =>
    props.noPadding &&
    `
      padding: 0;
    `}

  /* Full width */
  ${(props) =>
    props.fullWidth &&
    `
      width: 100%;
    `}

  /* Rounded */
  ${(props) =>
    props.rounded &&
    `
      border-radius: 50px;
    `}

  /* Border radius override */
  ${(props) =>
    props.borderRadius &&
    `
      border-radius: ${props.borderRadius};
    `}

  /* Custom shadow */
  ${(props) =>
    props.shadow &&
    `
      box-shadow: ${props.shadow};
    `}
`;

const CardHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => !['noBorder', 'noPadding'].includes(prop)
})`
  padding: ${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  
  ${(props) =>
    props.noBorder &&
    `
      border-bottom: none;
    `}
  
  ${(props) =>
    props.noPadding &&
    `
      padding: 0;
    `}
`;

const CardBody = styled.div.withConfig({
  shouldForwardProp: (prop) => !['noPadding'].includes(prop)
})`
  padding: ${theme.spacing.lg};
  
  ${(props) =>
    props.noPadding &&
    `
      padding: 0;
    `}
`;

const CardFooter = styled.div.withConfig({
  shouldForwardProp: (prop) => !['noBorder', 'noPadding'].includes(prop)
})`
  padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.gray[200]};
  
  ${(props) =>
    props.noBorder &&
    `
      border-top: none;
    `}
  
  ${(props) =>
    props.noPadding &&
    `
      padding: 0;
    `}
`;

const CardImage = styled.img`
  width: 100%;
  height: ${(props) => props.height || '200px'};
  object-fit: cover;
  display: block;
`;

const CardTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
  margin: 0 0 ${theme.spacing.sm} 0;
  
  ${(props) =>
    props.variant === 'dark' &&
    `
      color: ${theme.colors.white};
    `}
`;

const CardSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
  margin: 0 0 ${theme.spacing.md} 0;
  
  ${(props) =>
    props.variant === 'dark' &&
    `
      color: rgba(255, 255, 255, 0.8);
    `}
`;

const CardText = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.gray[700]};
  line-height: 1.6;
  margin: 0 0 ${theme.spacing.md} 0;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  ${(props) =>
    props.variant === 'dark' &&
    `
      color: rgba(255, 255, 255, 0.9);
    `}
`;

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImage,
  CardTitle,
  CardSubtitle,
  CardText,
};

export default Card;
