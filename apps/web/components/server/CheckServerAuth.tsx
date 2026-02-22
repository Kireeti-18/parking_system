import { redirect } from 'next/navigation';
import getSessionData from './getSessionData';

export default async function CheckServerAuth() {
  const sessionData = await getSessionData();

  const redirectToDashboard = () => {
    if (!sessionData) redirect('/signin');
    else return <></>;
  };

  redirectToDashboard();
}
