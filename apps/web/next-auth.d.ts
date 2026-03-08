import { SessionParkingInfo } from '@parking/validations';
import NextAuth, { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    user_id?: string;
    user_type?: 'user' | 'admin';
    email?: string | null;
    name?: string | null;
    avathar?: string | null;
    parking_info?: {
      parking_data: Array<SessionParkingInfo>;
      current_parking_index: number;
    };
    settings?: {
      nearestCount: number;
      nearestDistance: number;
      notifications: boolean;
    };
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      user_id?: string;
      user_type?: 'user' | 'admin';
      avathar?: string | null;
    } & DefaultSession['user'];
    parking_info?: {
      parking_data: Array<SessionParkingInfo>;
      current_parking_index: number;
    };
    settings?: {
      nearestCount: number;
      nearestDistance: number;
      notifications: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user_id?: string;
    user_type?: 'user' | 'admin';
    avathar?: string | null;
    parking_info?: {
      parking_data?: Array<SessionParkingInfo>;
      current_parking_index?: number;
    };
    settings?: {
      nearestCount?: number;
      nearestDistance?: number;
      notifications?: boolean;
    };
  }
}
