import ManualEntryForm from '../../../components/ManualEntryForm';
import getSessionData from '../../../components/server/getSessionData';

export default async function ManualEntry() {
  const session = await getSessionData();
  const parkingInfo = session.parkingInfo;
  return (
    <div className="h-full">
      <div className="min-h-full flex justify-center items-center bg-gray-100">
        <ManualEntryForm
          parkingAreaId={
            parkingInfo.parking_data[parkingInfo.current_parking_index]
              ?.parking_area_id || ''
          }
        />
      </div>
    </div>
  );
}
