'use client';

import { InputHTMLAttributes, useState } from 'react';
import { Icon } from './Icons';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  withToggle?: boolean;
  isError?: boolean;
  errorMessage?: string;
  styles?: string;
  labelstyles?: string;
};

export function InputBox({
  label,
  type,
  withToggle,
  errorMessage,
  isError = false,
  styles = 'text-sm',
  labelstyles = 'text-sm md:text-md text-gray-700',
  disabled = false,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password' && withToggle;

  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label className={`${labelstyles} ${disabled ? 'text-gray-400' : ''}`}>
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          {...props}
          disabled={disabled}
          type={isPassword && showPassword ? 'text' : type}
          className={`${styles} appearance-none rounded-xl border transition focus:outline-none
            ${
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : 'bg-white border-gray-300 focus:border-gray-500'
            }
          `}
        />

        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            <Icon name={showPassword ? 'eye-off' : 'eye'} />
          </button>
        )}
      </div>

      {isError && errorMessage && (
        <span className="text-xs text-red-600">{errorMessage}</span>
      )}
    </div>
  );
}
