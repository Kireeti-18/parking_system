export const ParkingStatus = Object.freeze({
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  DEPARTED: 'departed',
  MAINTENANCE: 'maintenance',
  AVAILABLE: 'available',
});

export const VehicleType = Object.freeze({
  BIKE: 'bike',
  CAR: 'car',
});

export const PricingType = Object.freeze({
  H1: '1h',
  H2: '2h',
  H6: '6h',
  H12: '12h',
  D1: '1d',
  D2: '2d',
  W1: '1w',
});

export const UserType = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  USER: 'user',
  ADMIN: 'admin',
  SUB_ADMIN: 'sub_admin',
  SECURITY: 'security',
});

export type ParkingStatusType =
  (typeof ParkingStatus)[keyof typeof ParkingStatus];
export type VehicleTypeType = (typeof VehicleType)[keyof typeof VehicleType];
export type PricingTypeType = (typeof PricingType)[keyof typeof PricingType];
export type UserTypeType = (typeof UserType)[keyof typeof UserType];

export const ParkingStatusSet = new Set(Object.values(ParkingStatus));
export const VehicleTypeSet = new Set(Object.values(VehicleType));
export const PricingTypeSet = new Set(Object.values(PricingType));
export const UserTypeSet = new Set(Object.values(UserType));

export function isValidType(
  setType: Set<string>,
  input: string | string[],
): boolean {
  if (typeof input === 'string') {
    return setType.has(input);
  }

  if (Array.isArray(input)) {
    return input.every((type) => setType.has(type));
  }

  return false;
}
