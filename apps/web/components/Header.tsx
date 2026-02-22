import Clock from './Clock';
import { Logo } from './Logo';
import ProfileDropdown from './ProfileDropdown';
import UserSearch from './UserSearch';
import { ParkingFilter } from './ParkingFilter';
import { RefreshLocation } from './RefreshLocation';

export function Header({
  type = ['default', false],
}: {
  type?: [string, boolean | null];
}) {
  return (
    <div className="sticky top-0 z-10 bg-white shadow h-16 flex items-center justify-between px-2 xl:px-10">
      <div className="flex gap-3 items-center">
        <Logo />
        {type[1] !== null && !type[1] && (
          <div className='flex gap-4 items-center'>
            <UserSearch /> <RefreshLocation />
          </div>
        )}
      </div>
      {type[0] === 'default' && (
        <div className="flex gap-7 items-center">
          {type[1] !== null && type[1] && <Clock />}
          <div className="flex items-center">
            <ProfileDropdown />
          </div>
        </div>
      )}
    </div>
  );
}
