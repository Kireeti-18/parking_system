import { getServerSession } from 'next-auth';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';

export default async function getSessionData() {
  const session = await getServerSession(authOptions);
  const parkingInfo = session?.parking_info || {
    parking_data: [],
    current_parking_index: 0,
  };
  const current_parking_index = parkingInfo?.current_parking_index || 0;
  const parking_data = parkingInfo?.parking_data ?? [];
  return {
    userInfo: session?.user,
    parkingInfo: parkingInfo,
    currentParkingInfo: parking_data[current_parking_index],
  };
}
