import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean; // Add disabled prop
}

export default function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled} // Use the disabled prop
    >
      {children}
    </button>
  );
}