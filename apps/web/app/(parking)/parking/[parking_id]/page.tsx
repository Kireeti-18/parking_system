import ParkingPage from '../../../../components/ParkingPage';
import getSessionData from '../../../../components/server/getSessionData';

type PageProps = {
  params: Promise<{ parking_id: string }>;
};

export default async function Parking({ params }: PageProps) {
  const { userInfo } = await getSessionData();

  const { parking_id } = await params;

  return (
    <div className=" h-[100%]">
      <ParkingPage id={parking_id} />
    </div>
  );
}
