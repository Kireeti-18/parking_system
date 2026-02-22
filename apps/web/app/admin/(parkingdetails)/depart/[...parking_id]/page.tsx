import { SharedPage } from '../../SharedPage';

export default async function ManualEntry({
  params,
}: {
  params: Promise<{ parking_id: string[] }>;
}) {
  const parkingParams = await params;
  const parkingIds = parkingParams.parking_id;
  const parkingId = parkingIds[0] || '';
  return <SharedPage parkingId={parkingId} />;
}
