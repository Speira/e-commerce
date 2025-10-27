import type { HTMLInputTypeAttribute } from 'react';

import { Field, FieldLabel, Input, Typography } from '~/components';
import type { NestedTranslationKey } from '~/lib/i18n';

type AuthInputProps = {
  children?: React.ReactNode;
  id: string;
  isLoading: boolean;
  label: NestedTranslationKey;
  onChange: (value: string) => void;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  value: string;
};

export const AuthInput = (props: AuthInputProps) => {
  const { id, label, isLoading, value, onChange, placeholder, children, type } =
    props;
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        <Typography label={label} />
      </FieldLabel>
      <Input
        disabled={isLoading}
        id={id}
        type={type}
        required
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {children}
    </Field>
  );
};
