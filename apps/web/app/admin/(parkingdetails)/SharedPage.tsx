// // import { Card, ClientRouter, Icon } from '../../../components/components';
// // import { GetParkingInfoAction } from '../../../lib/actions/parking_info';
// // import { TitleCase } from '@parking/services';

// import { TitleCase } from '@parking/services';
// import { Card } from './Card';
// import { ClientRouter } from '../../../components/ClientRoute';
// import { Icon } from '../../../components/Icons';
// import { GetParkingInfoAction } from '../../../lib/actions/parking_info';

// // export async function SharedPage({ parkingId }: { parkingId: string }) {
// //   const parkingInfo = await GetParkingInfoAction({
// //     parking_id: parkingId || '',
// //   });
// //   const parkingInfoDetails = parkingInfo.parkingInfo;
// //   return (
// //     <div className="h-full">
// //       {!parkingInfo.status ? (
// //         <div className="min-h-full flex justify-center items-center bg-gray-100">
// //           Parking not found
// //         </div>
// //       ) : (
// //         <div className="m-5">
// //           <div className="pt-2 pl-2">
// //             <ClientRouter route="/admin">
// //               <div className="flex items-center gap-2 pb-5 cursor-pointer">
// //                 <Icon name="arrow-left" size="4" />
// //                 <span className="text-gray-600">Back to Dashboard</span>
// //               </div>
// //             </ClientRouter>
// //             <div className="text-gray-900 font-semibold text-2xl">
// //               Parking Entry Details
// //             </div>
// //             <div>Parking id: {parkingInfoDetails?.parking_id}</div>
// //           </div>
// //           <div className="mt-2">
// //             <Card
// //               isZoom={false}
// //               className="px-4 py-2"
// //               roundedStyles="rounded-lg"
// //             >
// //               <div>
// //                 <div className="text-gray-900 font-semibold text-xl">
// //                   Vehicle Information
// //                 </div>
// //                 <div className="grid grid-cols-1 lg:grid-cols-4">
// //                   {parkingInfoDetails?.status !== 'maintenance' && (
// //                     <div>
// //                       <div className="text-gray-800 font-semibold">
// //                         Vehicle Number
// //                       </div>
// //                       <div>{parkingInfoDetails?.vehicle_number}</div>
// //                     </div>
// //                   )}

// //                   <div>
// //                     <div className="text-gray-800 font-semibold">
// //                       Vehicle Type
// //                     </div>
// //                     <div>{TitleCase(parkingInfoDetails?.vehicle_type)}</div>
// //                   </div>

// //                   <div>
// //                     <div className="text-gray-800 font-semibold">
// //                       Slot Number
// //                     </div>
// //                     <div>{parkingInfoDetails?.slot_number}</div>
// //                   </div>
// //                   <div>
// //                     <div className="text-gray-800 font-semibold">
// //                       Parking Status
// //                     </div>
// //                     <div>{TitleCase(parkingInfoDetails?.status)}</div>
// //                   </div>
// //                   {parkingInfoDetails?.status === 'maintenance' && (
// //                     <div>
// //                       <div className="text-gray-800 font-semibold">
// //                         Parking Status
// //                       </div>
// //                       <div>
// //                         {TitleCase(
// //                           (parkingInfoDetails?.parking_other_info || {})
// //                             ?.maintenance_reason,
// //                         )}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </Card>
// //           </div>
// //           <div className="mt-6">
// //             <Card
// //               isZoom={false}
// //               className="py-2 px-4"
// //               roundedStyles="rounded-lg"
// //             >
// //               <div>
// //                 <div className="text-gray-900 font-semibold text-xl">
// //                   Timing Information
// //                 </div>
// //                 <div className="grid grid-cols-1 lg:grid-cols-3">
// //                   <div>
// //                     <div className="text-gray-800 font-semibold">
// //                       Parked Date
// //                     </div>
// //                     <div>{parkingInfoDetails?.parked_date}</div>
// //                   </div>
// //                   <div>
// //                     <div className="text-gray-800 font-semibold">
// //                       Parked Time
// //                     </div>
// //                     <div>{parkingInfoDetails?.parked_time}</div>
// //                   </div>
// //                   <div>
// //                     <div className="text-gray-800 font-semibold">
// //                       Parked Hours
// //                     </div>
// //                     <div>{parkingInfoDetails?.parking_parked_hours}</div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </Card>
// //           </div>
// //           <div
// //             className={`grid grid-cols-1 ${parkingInfoDetails?.status !== 'maintenance' ? 'lg:grid-cols-2' : ''} gap-x-5 mt-6`}
// //           >
// //             {parkingInfoDetails?.status !== 'maintenance' && (
// //               <Card
// //                 isZoom={false}
// //                 className="py-2 px-4"
// //                 roundedStyles="rounded-lg"
// //               >
// //                 <div>
// //                   <div className="text-gray-900 font-semibold text-xl">
// //                     Parked User
// //                   </div>
// //                   <div>
// //                     <div className="text-gray-800 font-semibold">Name</div>
// //                     <div>{TitleCase(parkingInfoDetails?.parked_user_name)}</div>
// //                   </div>

// //                   <div>
// //                     <div className="text-gray-800 font-semibold">Email</div>
// //                     <div>{parkingInfoDetails?.parked_user_email}</div>
// //                   </div>
// //                   <div>
// //                     <div className="text-gray-800 font-semibold">User Type</div>
// //                     <div>
// //                       {TitleCase(parkingInfoDetails?.parked_user_user_type)}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </Card>
// //             )}
// //             <Card
// //               isZoom={false}
// //               className="py-2 px-4"
// //               roundedStyles="rounded-lg"
// //             >
// //               <div>
// //                 <div className="text-gray-900 font-semibold text-xl">
// //                   Admin Information
// //                 </div>
// //                 <div>
// //                   <div className="text-gray-800 font-semibold">Name</div>
// //                   <div>{TitleCase(parkingInfoDetails?.parked_admin_name)}</div>
// //                 </div>

// //                 <div>
// //                   <div className="text-gray-800 font-semibold">Email</div>
// //                   <div>{parkingInfoDetails?.parked_admin_email}</div>
// //                 </div>
// //                 <div>
// //                   <div className="text-gray-800 font-semibold">User Type</div>
// //                   <div>
// //                     {TitleCase(parkingInfoDetails?.parked_admin_user_type)}
// //                   </div>
// //                 </div>
// //               </div>
// //             </Card>
// //           </div>
// //           {parkingInfoDetails?.status !== 'maintenance' && (
// //             <div className="mt-6">
// //               <Card
// //                 isZoom={false}
// //                 className="py-2 px-4"
// //                 roundedStyles="rounded-lg"
// //               >
// //                 <div>
// //                   <div className="text-gray-900 font-semibold text-xl">
// //                     Parking Area Information
// //                   </div>
// //                   <div className="grid grid-cols-2">
// //                     <div>
// //                       <div className="text-gray-800 font-semibold">
// //                         Parking Area Name
// //                       </div>
// //                       <div>{parkingInfoDetails?.parking_area_name}</div>
// //                     </div>
// //                     <div>
// //                       <div className="text-gray-800 font-semibold">Status</div>
// //                       <div>
// //                         {parkingInfoDetails?.parking_is_opened
// //                           ? 'Opend'
// //                           : 'Closed'}
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <div className="text-gray-800 font-semibold">Location</div>
// //                     <div>{`${parkingInfoDetails?.parking_area_location?.lat} ${parkingInfoDetails?.parking_area_location?.lng}`}</div>
// //                   </div>
// //                 </div>
// //               </Card>
// //             </div>
// //           )}
// //           {parkingInfoDetails?.status !== 'maintenance' && (
// //             <div className="pb-30">
// //               <div className="mt-6">
// //                 <Card
// //                   isZoom={false}
// //                   className="py-2 px-4"
// //                   roundedStyles="rounded-lg"
// //                 >
// //                   <div>
// //                     <div className="text-gray-900 font-semibold text-xl">
// //                       Pricing Information
// //                     </div>
// //                     <div className="grid grid-cols-1 lg:grid-cols-3">
// //                       <div>
// //                         <div className="text-gray-800 font-semibold">
// //                           Parking Price
// //                         </div>
// //                         <div>₹{parkingInfoDetails?.parking_price}</div>
// //                       </div>
// //                       <div>
// //                         <div className="text-gray-800 font-semibold">
// //                           Parking Type
// //                         </div>
// //                         <div>{parkingInfoDetails?.parking_price_type}</div>
// //                       </div>
// //                       <div>
// //                         <div className="text-gray-800 font-semibold">
// //                           Parking Fee
// //                         </div>
// //                         <div>₹{parkingInfoDetails?.parking_fee}</div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </Card>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// const SectionTitle = ({ title }: { title: string }) => (
//   <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
// );

// const InfoItem = ({
//   label,
//   value,
// }: {
//   label: string;
//   value?: React.ReactNode;
// }) => (
//   <div>
//     <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
//       {label}
//     </div>
//     <div className="text-sm font-medium text-gray-900">{value || '—'}</div>
//   </div>
// );

// export async function SharedPage({ parkingId }: { parkingId: string }) {
//   const parkingInfo = await GetParkingInfoAction({
//     parking_id: parkingId || '',
//   });
//   const parkingInfoDetails = parkingInfo.parkingInfo;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {!parkingInfo.status ? (
//         <div className="min-h-screen flex items-center justify-center text-gray-500">
//           Parking not found
//         </div>
//       ) : (
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="mb-6">
//             <ClientRouter route="/admin">
//               <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer mb-4">
//                 <Icon name="arrow-left" size="4" />
//                 <span className="text-sm font-medium">Back to Dashboard</span>
//               </div>
//             </ClientRouter>

//             <h1 className="text-2xl font-semibold text-gray-900">
//               Parking Entry Details
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Parking ID: {parkingInfoDetails?.parking_id}
//             </p>
//           </div>

//           <Card isZoom={false} roundedStyles="rounded-xl" className="p-5 mb-6">
//             <SectionTitle title="Vehicle Information" />

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
//               {parkingInfoDetails?.status !== 'maintenance' && (
//                 <InfoItem
//                   label="Vehicle Number"
//                   value={parkingInfoDetails?.vehicle_number}
//                 />
//               )}

//               <InfoItem
//                 label="Vehicle Type"
//                 value={TitleCase(parkingInfoDetails?.vehicle_type)}
//               />
//               <InfoItem
//                 label="Slot Number"
//                 value={parkingInfoDetails?.slot_number}
//               />
//               <InfoItem
//                 label="Parking Status"
//                 value={TitleCase(parkingInfoDetails?.status)}
//               />

//               {parkingInfoDetails?.status === 'maintenance' && (
//                 <InfoItem
//                   label="Maintenance Reason"
//                   value={TitleCase(
//                     parkingInfoDetails?.parking_other_info?.maintenance_reason,
//                   )}
//                 />
//               )}
//             </div>
//           </Card>

//           <Card isZoom={false} roundedStyles="rounded-xl" className="p-5 mb-6">
//             <SectionTitle title="Timing Information" />

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
//               <InfoItem
//                 label="Parked Date"
//                 value={parkingInfoDetails?.parked_date}
//               />
//               <InfoItem
//                 label="Parked Time"
//                 value={parkingInfoDetails?.parked_time}
//               />
//               <InfoItem
//                 label="Parked Hours"
//                 value={parkingInfoDetails?.parking_parked_hours}
//               />
//             </div>
//           </Card>

//           <div
//             className={`grid grid-cols-1 ${
//               parkingInfoDetails?.status !== 'maintenance'
//                 ? 'lg:grid-cols-2'
//                 : ''
//             } gap-6 mb-6`}
//           >
//             {parkingInfoDetails?.status !== 'maintenance' && (
//               <Card isZoom={false} roundedStyles="rounded-xl" className="p-5">
//                 <SectionTitle title="Parked User" />

//                 <div className="space-y-4 mt-4">
//                   <InfoItem
//                     label="Name"
//                     value={TitleCase(parkingInfoDetails?.parked_user_name)}
//                   />
//                   <InfoItem
//                     label="Email"
//                     value={parkingInfoDetails?.parked_user_email}
//                   />
//                   <InfoItem
//                     label="User Type"
//                     value={TitleCase(parkingInfoDetails?.parked_user_user_type)}
//                   />
//                 </div>
//               </Card>
//             )}

//             <Card isZoom={false} roundedStyles="rounded-xl" className="p-5">
//               <SectionTitle title="Admin Information" />

//               <div className="space-y-4 mt-4">
//                 <InfoItem
//                   label="Name"
//                   value={TitleCase(parkingInfoDetails?.parked_admin_name)}
//                 />
//                 <InfoItem
//                   label="Email"
//                   value={parkingInfoDetails?.parked_admin_email}
//                 />
//                 <InfoItem
//                   label="User Type"
//                   value={TitleCase(parkingInfoDetails?.parked_admin_user_type)}
//                 />
//               </div>
//             </Card>
//           </div>

//           {parkingInfoDetails?.status !== 'maintenance' && (
//             <Card
//               isZoom={false}
//               roundedStyles="rounded-xl"
//               className="p-5 mb-6"
//             >
//               <SectionTitle title="Parking Area Information" />

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
//                 <InfoItem
//                   label="Parking Area Name"
//                   value={parkingInfoDetails?.parking_area_name}
//                 />
//                 <InfoItem
//                   label="Status"
//                   value={
//                     parkingInfoDetails?.parking_is_opened ? 'Open' : 'Closed'
//                   }
//                 />
//               </div>

//               <div className="mt-4">
//                 <InfoItem
//                   label="Location"
//                   value={`${parkingInfoDetails?.parking_area_location?.lat}, ${parkingInfoDetails?.parking_area_location?.lng}`}
//                 />
//               </div>
//             </Card>
//           )}

//           {parkingInfoDetails?.status !== 'maintenance' && (
//             <Card isZoom={false} roundedStyles="rounded-xl" className="p-5">
//               <SectionTitle title="Pricing Information" />

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
//                 <InfoItem
//                   label="Parking Price"
//                   value={`₹${parkingInfoDetails?.parking_price}`}
//                 />
//                 <InfoItem
//                   label="Parking Type"
//                   value={parkingInfoDetails?.parking_price_type}
//                 />
//                 <InfoItem
//                   label="Parking Fee"
//                   value={`₹${parkingInfoDetails?.parking_fee}`}
//                 />
//               </div>
//             </Card>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { Card, ClientRouter, Icon } from '../../../components/components';
import { getParkingInfoAction } from '../../../lib/actions/parking_info';
import { TitleCase } from '@parking/services';

export async function SharedPage({ parkingId }: { parkingId: string }) {
  const parkingInfo = await getParkingInfoAction({
    parking_id: parkingId || '',
  });

  const parkingInfoDetails = parkingInfo.parkingInfo;

  if (!parkingInfo.status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Parking not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <ClientRouter route="/admin">
            <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer mb-4">
              <Icon name="arrow-left" size="4" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </div>
          </ClientRouter>

          <h1 className="text-2xl font-semibold text-gray-900">
            Parking Entry Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Parking ID: {parkingInfoDetails?.parking_id}
          </p>
        </div>

        <Card className="p-5 mb-6">
          <SectionTitle title="Vehicle Information" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {parkingInfoDetails?.status !== 'maintenance' && (
              <InfoItem
                label="Vehicle Number"
                value={parkingInfoDetails?.vehicle_number}
              />
            )}

            <InfoItem
              label="Vehicle Type"
              value={TitleCase(parkingInfoDetails?.vehicle_type)}
            />

            <InfoItem
              label="Slot Number"
              value={parkingInfoDetails?.slot_number}
            />

            <InfoItem
              label="Parking Status"
              value={TitleCase(parkingInfoDetails?.status)}
            />

            {parkingInfoDetails?.status === 'maintenance' && (
              <InfoItem
                label="Maintenance Reason"
                value={TitleCase(
                  parkingInfoDetails?.parking_other_info?.maintenance_reason,
                )}
              />
            )}
          </div>
        </Card>

        <Card className="p-5 mb-6">
          <SectionTitle title="Timing Information" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
            <InfoItem
              label="Parked Date"
              value={parkingInfoDetails?.parked_date}
            />
            <InfoItem
              label="Parked Time"
              value={parkingInfoDetails?.parked_time}
            />
            <InfoItem
              label="Parked Hours"
              value={parkingInfoDetails?.parking_parked_hours}
            />
          </div>
        </Card>

        <div
          className={`grid grid-cols-1 ${
            parkingInfoDetails?.status !== 'maintenance' ? 'lg:grid-cols-2' : ''
          } gap-6 mb-6`}
        >
          {parkingInfoDetails?.status !== 'maintenance' && (
            <Card className="p-5">
              <SectionTitle title="Parked User" />

              <div className="space-y-4 mt-4">
                <InfoItem
                  label="Name"
                  value={TitleCase(parkingInfoDetails?.parked_user_name)}
                />
                <InfoItem
                  label="Email"
                  value={parkingInfoDetails?.parked_user_email}
                />
                <InfoItem
                  label="User Type"
                  value={TitleCase(parkingInfoDetails?.parked_user_user_type)}
                />
              </div>
            </Card>
          )}

          <Card className="p-5">
            <SectionTitle title="Admin Information" />

            <div className="space-y-4 mt-4">
              <InfoItem
                label="Name"
                value={TitleCase(parkingInfoDetails?.parked_admin_name || '')}
              />
              <InfoItem
                label="Email"
                value={parkingInfoDetails?.parked_admin_email}
              />
              <InfoItem
                label="User Type"
                value={TitleCase(
                  parkingInfoDetails?.parked_admin_user_type || '',
                )}
              />
            </div>
          </Card>
        </div>

        {parkingInfoDetails?.status !== 'maintenance' && (
          <Card className="p-5 mb-6">
            <SectionTitle title="Parking Area Information" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <InfoItem
                label="Parking Area Name"
                value={parkingInfoDetails?.parking_area_name}
              />
              <InfoItem
                label="Status"
                value={
                  parkingInfoDetails?.parking_is_opened ? 'Open' : 'Closed'
                }
              />
            </div>

            <div className="mt-4">
              <InfoItem
                label="Location"
                value={`${parkingInfoDetails?.parking_area_location?.lat}, ${parkingInfoDetails?.parking_area_location?.lng}`}
              />
            </div>
          </Card>
        )}

        {parkingInfoDetails?.status !== 'maintenance' && (
          <Card className="p-5">
            <SectionTitle title="Pricing Information" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
              <InfoItem
                label="Parking Price"
                value={`₹${parkingInfoDetails?.parking_price}`}
              />
              <InfoItem
                label="Parking Type"
                value={parkingInfoDetails?.parking_price_type}
              />
              <InfoItem
                label="Parking Fee"
                value={`₹${parkingInfoDetails?.parking_fee}`}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
);

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
      {label}
    </div>
    <div className="text-sm font-medium text-gray-900">{value || '—'}</div>
  </div>
);
