import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, value, onChange, onKeyPress, disabled, ...rest }, ref) => {
    return (
      <input
        type="text"
        className="border rounded px-3 py-2 w-full"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
        ref={ref}
        {...rest}
      />
    );
  }
);

// Add display name for better debugging
Input.displayName = 'Input';

export default Input;