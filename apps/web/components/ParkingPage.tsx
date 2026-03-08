import { TitleCase, TitleCaseA } from '@parking/services';
import { getParkingInfo } from '../lib/actions/parking_info';
import { Icon } from './Icons';
import { MapComponent } from './MapComponent';
import { ClientRouter } from './ClientRoute';
import getSessionData from './server/getSessionData';
import ParkingActions from './ParkingPageActions';
import NavigationBtn from './NaviagtionBtn';

const AvailabilityBlock = ({ icon, color, label, available, total }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Icon name={icon} styles={color} />
      {label}
    </div>
    <div className="text-2xl font-semibold text-gray-900">
      {available}
      <span className="text-sm text-gray-400 font-normal ml-1">/ {total}</span>
    </div>
  </div>
);

const OccupiedBlock = ({ icon, color, occupied }: any) => (
  <div className="flex items-center gap-2">
    <Icon name={icon} styles={color} />
    <span>
      Occupied: <strong>{occupied}</strong>
    </span>
  </div>
);

const PriceBlock = ({ icon, color, price }: any) => (
  <div className="flex items-center gap-2 text-sm">
    <Icon name={icon} styles={color} />
    <span className="font-semibold text-gray-900">₹{price}</span>
    <span className="text-gray-500">/ hour</span>
  </div>
);

const ParkingPage = async ({ id }: { id: string }) => {
  const parking = await getParkingInfo({ id });
  const session = await getSessionData();
  const userInfo = session.userInfo;
  const userType = userInfo?.user_type;

  if (parking.status !== 200 || !userInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500 bg-gray-50">
        {parking.status !== 200 ? 'Parking not found' : 'Invalid User Info'}
      </div>
    );
  }

  const parkingInfo = parking.parking_info || {};
  const loc = parkingInfo.parking_location;

  return (
    <div className="bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <ClientRouter route="/">
          <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer mb-6">
            <Icon name="arrow-left" size="4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </div>
        </ClientRouter>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[55%] rounded-3xl bg-white shadow-md p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 truncate">
                    {TitleCase(parkingInfo.parking_area_name)}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {TitleCaseA(
                      (parkingInfo.other_parking_info?.address || '').split(
                        ',',
                      ),
                    )}
                  </p>
                </div>
                <div className="flex gap-3">
                  <ParkingActions
                    isOpened={parkingInfo.is_opened}
                    parkingId={parkingInfo.parking_area_id}
                    userInfo={{ email: userInfo?.email || '' }}
                    type="status"
                  />
                  <div className="hidden sm:flex justify-end">
                    {loc?.lat && loc?.lng && (
                      <NavigationBtn
                        coordinates={{ lat: loc.lat, lng: loc.lng }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:hidden">
                {loc?.lat && loc?.lng && (
                  <NavigationBtn coordinates={{ lat: loc.lat, lng: loc.lng }} />
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Current Availability
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <AvailabilityBlock
                  icon="bike"
                  color="text-primary"
                  label="Bikes"
                  available={parkingInfo.available_bike_slots}
                  total={parkingInfo.bike_slots}
                />
                <AvailabilityBlock
                  icon="car"
                  color="text-secondary"
                  label="Cars"
                  available={parkingInfo.available_car_slots}
                  total={parkingInfo.car_slots}
                />
              </div>
            </div>

            {userType === 'admin' && (
              <div className="flex gap-8 text-sm text-gray-600 flex-row">
                <OccupiedBlock
                  icon="bike"
                  color="text-primary"
                  occupied={
                    parkingInfo.bike_slots - parkingInfo.available_bike_slots
                  }
                />
                <OccupiedBlock
                  icon="car"
                  color="text-secondary"
                  occupied={
                    parkingInfo.car_slots - parkingInfo.available_car_slots
                  }
                />
              </div>
            )}

            <div>
              <div className="text-sm text-gray-500 mb-2">
                Pricing Type:
                <span className="font-medium text-gray-800">
                  {parkingInfo.pricing_type}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <PriceBlock
                  icon="bike"
                  color="text-primary"
                  price={parkingInfo.bike_price_per_hour}
                />
                <PriceBlock
                  icon="car"
                  color="text-secondary"
                  price={parkingInfo.car_price_per_hour}
                />
              </div>
            </div>

            {userType === 'user' && parkingInfo.is_opened && (
              <div className="pt-4 mt-4 border-t border-gray-100">
                <ParkingActions
                  type="book"
                  isOpened={parkingInfo.is_opened}
                  parkingId={parkingInfo.parking_area_id}
                  userInfo={{ email: userInfo?.email || '' }}
                />
              </div>
            )}
          </div>
          <div className="w-full lg:w-[45%] rounded-3xl bg-white shadow-md ">
            {loc?.lat && loc?.lng ? (
              <MapComponent
                coordinates={{ lat: loc.lat, lng: loc.lng }}
                height="440px"
                onlyLocation={false}
              />
            ) : (
              <div className="h-[420px] flex items-center justify-center text-gray-400">
                Location unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingPage;
