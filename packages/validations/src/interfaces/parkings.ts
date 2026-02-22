export type ParkingType = {
  parking_area_id: string;
  parking_area_name: string;
  bike_slots: number;
  car_slots: number;
  is_opened: boolean;
  pricing_type: string;
  car_price_per_hour: number;
  bike_price_per_hour: number;
  verification_status: boolean;
  distance?: number;
  other_parking_info: {
    address?: string;
  };
  available_bike_slots?: number;
  available_car_slots?: number;
  car_pricing?: number;
  bike_pricing?: number;
  parking_location?: {
    lat: number | null;
    lng: number | null;
  };
};

export type ParkingsType = ParkingType[];
