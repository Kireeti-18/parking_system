'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icons';

interface CustomCheckboxProps {
  checked?: boolean;
  onChange: (value: boolean) => void;
  textTrue?: string;
  textFalse?: string;
  labelStyle?: string;
  disabled?: boolean;
}

export function CustomCheckbox({
  checked = false,
  onChange,
  textTrue = 'Checked',
  textFalse = 'Unchecked',
  labelStyle = 'text-sm',
  disabled = false,
}: CustomCheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleClick = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <div
      className={`flex items-center gap-2 ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      onClick={handleClick}
      aria-disabled={disabled}
    >
      <div
        className={`
          w-[22px] h-[22px]
          rounded-md
          border-2
          flex items-center justify-center
          select-none
          ${
            isChecked
              ? 'border-primary bg-primary text-white'
              : 'border-gray-500'
          }
        `}
      >
        {isChecked && <Icon name="check" />}
      </div>

      <span className={`${labelStyle}`}>
        {isChecked ? textTrue : textFalse}
      </span>
    </div>
  );
}
