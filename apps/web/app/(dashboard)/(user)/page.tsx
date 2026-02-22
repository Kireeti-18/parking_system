import { NearestLocation } from '../../../components/NearestLocation';
import getSessionData from '../../../components/server/getSessionData';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userInfo } = await getSessionData();

  if (userInfo?.user_type !== 'user') {
    if (userInfo?.user_type === 'admin') redirect('/admin');
    redirect('/signin');
  }
  return (
    <>
      <div className="px-4 py-6">
        <NearestLocation />
      </div>
    </>
  );
}
