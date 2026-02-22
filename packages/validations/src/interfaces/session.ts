import { LatLng } from './map';

export type SessionUserInfo = {
  user_id: string;
  name: string;
  email: string;
  user_type: string;
  avathar: string;
} | null;

export type Session = {
  isLoggedIn: boolean;
  userInfo: SessionUserInfo;
};

export type SessionContextType = {
  session: Session;
  setSession: (s: Session) => void;
};

export type SessionParkingInfo = {
  parking_area_id: string;
  parking_area_name: string;
  parking_location: LatLng;
  total_slots: number;
  bike_slots: number;
  car_slots: number;
  is_opened: boolean;
  pricing_type: string;
  car_price_per_hour: number;
  bike_price_per_hour: number;
  total_revenue: number;
  other_parking_info: {
    address?: string;
  };
  distance?: number;
};
