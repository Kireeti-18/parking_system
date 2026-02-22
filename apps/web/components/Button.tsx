'use client';
import { ReactNode } from 'react';
import {
  btnPointers,
  BtnPointerType,
  buttonColorClasses,
  ColorType,
} from '@parking/services';

interface ButtonProps {
  children: ReactNode;
  styles?: string;
  onSubmit: () => void;
  btnColor?: ColorType;
  pointer_type?: BtnPointerType;
}

export const Button = ({
  children,
  styles = 'text-gray-900',
  onSubmit,
  btnColor = 'primary',
  pointer_type = 'cursor',
}: ButtonProps) => {
  const submitHandler = () => {
    onSubmit();
  };

  return (
    <button
      className={`${styles} w-full flex justify-center py-2 ${btnPointers[pointer_type]} ${buttonColorClasses[btnColor]}`}
      onClick={submitHandler}
    >
      {children}
    </button>
  );
};
