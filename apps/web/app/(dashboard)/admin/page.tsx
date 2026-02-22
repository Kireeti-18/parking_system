import {
  Card,
  ParkingLocation,
  ParkingOverview,
  Icon,
  IconName,
} from '../../../components/components';
import getSessionData from '../../../components/server/getSessionData';
import { redirect } from 'next/navigation';
import {
  getParkingAdminAnalytics,
  getParkingSlotsStatusInfo,
} from '../../../lib/actions/parking_info';
import { LatLng } from '@parking/validations';
import { TitleCaseA } from '@parking/services';
import ParkingStatusCard from '../../../components/ParkingStatusCard';

export default async function Home() {
  const { userInfo, parkingInfo } = await getSessionData();

  if (userInfo?.user_type !== 'admin') {
    if (userInfo?.user_type === 'user') redirect('/');
    redirect('/signin');
  }
  // await update({ current_parking_index: index });

  const currentParkingIndex = parkingInfo?.current_parking_index;
  const currentParkingData = parkingInfo?.parking_data[currentParkingIndex];
  if (!currentParkingData) {
    return <div>No parking info</div>;
  }

  const coordinates: LatLng = currentParkingData?.parking_location || {
    lat: 0,
    lng: 0,
  };
  const parkingSlotsInfo = await getParkingSlotsStatusInfo();
  const adminAnalytics = await getParkingAdminAnalytics();

  interface AdminDashboardCardProps {
    title: string;
    total: number;
    available?: number;
    occupied?: number;
    changePercent: number;
    changeText: string;
    type: 'slot' | 'revenue';
  }

  const AdminDashboardCard = ({
    title,
    total,
    available,
    occupied,
    changePercent,
    changeText,
    type,
  }: AdminDashboardCardProps) => {
    const isIncrease = changePercent > 0;

    return (
      <Card className="relative py-4 px-6 w-full h-36 rounded-2xl shadow-md bg-white">
        <h2 className="text-sm text-gray-500 font-medium">{title}</h2>
        <p className="mt-1 text-4xl font-bold text-gray-900">{`${type === 'revenue' ? '₹' : ''}${total}`}</p>
        {type === 'slot' && (
          <div className="mt-1 flex items-center space-x-4 text-sm">
            <p className="font-medium">
              Available:{' '}
              <span className="text-green-600 font-semibold">{available}</span>
            </p>
            <p className="font-medium">
              Occupied:{' '}
              <span className="text-red-600 font-semibold">{occupied}</span>
            </p>
          </div>
        )}
        <p
          className={`text-xs ${type === 'slot' ? 'mt-1' : 'mt-2'} font-medium`}
        >
          <span
            className={` ${isIncrease ? 'text-green-600' : 'text-red-600'}`}
          >
            {`${type !== 'revenue' ? (isIncrease ? '+' : '-') : '₹'}${changePercent}${type !== 'revenue' ? '%' : ''}`}
          </span>
          {` ${changeText}`}
        </p>
      </Card>
    );
  };

  const QuickAction = ({
    type,
  }: {
    type: 'auto_entry' | 'manual_entry' | 'auto_depart' | 'manual_depart';
  }) => {
    let text = '';
    let route = '';
    let icon: IconName = 'scanner';

    switch (type) {
      case 'auto_entry':
        text = 'Auto Entry';
        icon = 'scanner';
        route = '/not_implemented';
        break;
      case 'manual_entry':
        text = 'Manual Entry';
        route = '/admin/manual_entry';
        icon = 'circle-plus';
        break;
      case 'auto_depart':
        text = 'Auto Depart';
        icon = 'exit';
        route = '/not_implemented';
        break;
      case 'manual_depart':
        text = 'Manual Depart';
        icon = 'circle-wrong';
        route = '/admin/manual_depart';
        break;
    }

    return (
      <Card isZoom={true} rounded={false} pointer={true} route={route}>
        <div className="h-15 w-full bg-blue-50 px-4 flex items-center gap-10 rounded-md border-[0.1px] border-gray-300">
          <Icon name={`${icon}`} />
          <span>{text}</span>
        </div>
      </Card>
    );
  };
  return (
    <>
      <div>
        <div className="flex justify-between mt-5 mr-10 items-center">
          <div className="flex flex-col mx-6">
            <span className="text-gray-700 font-semibold text-3xl">
              {currentParkingData.parking_area_name}
            </span>
            {currentParkingData.other_parking_info &&
              currentParkingData.other_parking_info?.address && (
                <span className="text-sm text-gray-500">
                  {TitleCaseA(
                    currentParkingData.other_parking_info.address.split(', '),
                  )}
                </span>
              )}
          </div>
          <div className="flex gap-2 items-center">
            <ParkingStatusCard
              type="type-1"
              isOpen={currentParkingData.is_opened}
              parkingId={currentParkingData.parking_area_id}
            />
            <ParkingLocation coordinates={coordinates ?? {}} />
          </div>
        </div>
        <div className="my-5 mx-6 grid grid-cols-1 md:grid-cols-2  2xl:grid-cols-4 gap-4 xl:gap-8">
          <AdminDashboardCard
            title={'Total Slots'}
            total={currentParkingData.total_slots}
            available={adminAnalytics.over_analytics.available}
            occupied={adminAnalytics.over_analytics.occupied}
            changePercent={Number(
              (
                (adminAnalytics.over_analytics.occupied /
                  currentParkingData.total_slots) *
                100
              ).toFixed(2),
            )}
            changeText={'Occupied percentage'}
            type="slot"
          />
          <AdminDashboardCard
            title={'Bike Slots'}
            total={currentParkingData.bike_slots}
            available={adminAnalytics.bike_analytics.available}
            occupied={adminAnalytics.bike_analytics.occupied}
            changePercent={Number(
              (
                (adminAnalytics.bike_analytics.occupied /
                  currentParkingData.bike_slots) *
                100
              ).toFixed(2),
            )}
            changeText={'Occupied percentage'}
            type="slot"
          />
          <AdminDashboardCard
            title={'Car Slots'}
            total={currentParkingData.car_slots}
            available={adminAnalytics.car_analytics.available}
            occupied={adminAnalytics.car_analytics.occupied}
            changePercent={Number(
              (
                (adminAnalytics.car_analytics.occupied /
                  currentParkingData.car_slots) *
                100
              ).toFixed(2),
            )}
            changeText={'Occupied percentage'}
            type="slot"
          />
          <AdminDashboardCard
            title={'Total Revenue'}
            total={adminAnalytics.revenue.today_revenue}
            changePercent={adminAnalytics.revenue.month_revenue}
            changeText={'Monthly revenue'}
            type="revenue"
          />
        </div>

        <Card isZoom={false} className="mx-6 mt-10 py-20">
          <div className="h-full mx-10 flex justify-between items-center">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-40 gap-y-10">
              <QuickAction type="auto_entry" />
              <QuickAction type="manual_entry" />
              <QuickAction type="auto_depart" />
              <QuickAction type="manual_depart" />
            </div>
          </div>
        </Card>
        <ParkingOverview parkingSlotsInfo={parkingSlotsInfo} />
      </div>
    </>
  );
}
