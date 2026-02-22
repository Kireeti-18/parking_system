import { PricingTypeType } from '@parking/validations';

export const buttonColorClasses = {
  blue: 'bg-blue-400',
  gray: 'bg-gray-400',
  red: 'bg-red-400',
  green: 'bg-green-400',
  primary: 'bg-primary',
  custom: '',
};

export const btnPointers = {
  cursor: 'cursor-pointer',
  default: 'cursor-default',
  none: 'cursor-none',
  not_allowed: 'cursor-not-allowed',
};

export type ColorType =
  | 'blue'
  | 'gray'
  | 'red'
  | 'green'
  | 'primary'
  | 'custom';
export type WidthType = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type BtnPointerType = 'default' | 'cursor' | 'none' | 'not_allowed';

const toTitleCase = (value: string) => {
  return (
    value
      ?.toLowerCase()
      ?.split(' ')
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(' ') || ''
  );
};

export function TitleCase(input: string): string {
  return toTitleCase(input);
}

export function TitleCaseA(input: string[]): string {
  return input.map(toTitleCase).join(', ');
}

export function getHoursFromParkingPriceType(type: PricingTypeType) {
  const pricingTypeMap = {
    '1h': 1,
    '2h': 2,
    '6h': 6,
    '12h': 12,
    '1d': 24,
    '2d': 48,
    '1w': 168,
  } as const;

  return pricingTypeMap[type] ?? 24;
}

export function formatDateTimeReadable24(isoString: string): [string, string] {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return ['Invalid date', 'Invalid time'];

  const day = date.getDate().toString().padStart(2, '0');

  const month = date.toLocaleString('en-US', { month: 'short' });

  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const formattedDate = `${day} ${month} ${year}`;
  const formattedTime = `${hours}:${minutes}`;

  return [formattedDate, formattedTime];
}

export function isEmail(str: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(str);
}
