import React from 'react';
import styled from 'styled-components';
import Input from './Input';
import theme from '../../styles/theme';

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[700]};
`;

const ErrorText = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.error};
`;

const TextArea = styled(Input).attrs({ as: 'textarea' })`
  height: auto;
  min-height: ${(props) => (props.rows ? `${props.rows * 24}px` : '96px')};
  padding-top: ${theme.spacing.sm};
  resize: vertical;
  line-height: 1.5;
`;

const FormField = ({ label, error, as, rows, ...props }) => {
  const Component = as === 'textarea' ? TextArea : Input;

  return (
    <Field>
      {label && <Label htmlFor={props.id || props.name}>{label}</Label>}
      <Component rows={rows} error={!!error} {...props} />
      {error && typeof error === 'string' && <ErrorText>{error}</ErrorText>}
    </Field>
  );
};

export default FormField;
