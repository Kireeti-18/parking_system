import { ParkingStatusType } from '../enums';
import { getParkingInfoHash } from '../../../services/index';

export type VehicleEntry = {
  parking_type: string;
  user_identification: string;
  vehicle_number: string;
  vehicle_type: string;
  register: boolean;
  is_custom_slot: boolean;
  slot: number;
  maintenance_reason?: string;
  depart_code?: string;
  parking_area_id: string;
};

export type vehicleEntry = VehicleEntry;

export type OnlyParkingInfoHashType = ReturnType<typeof getParkingInfoHash>;

export type ParkingInfoHashType =
  | { status: ParkingStatusType; parking_id: string }
  | ReturnType<typeof getParkingInfoHash>;
