import React from 'react';

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function Input({ placeholder, value, onChange, onKeyPress, disabled }: InputProps) {
  return (
    <input
      type="text"
      className="border rounded px-3 py-2 w-full"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      disabled={disabled}
    />
  );
}