import { API_DOMAIN } from '../helper/domain';
import { UserModel } from '@mw/data-model';

const UserItem = ({ user }: { user: UserModel }) => {
  return (
    <div
      className={
        'p-4 border flex items-center rounded-md hover:bg-gray-100 space-x-4'
      }
    >
      <div className="w-12 h-12">
        {user.avatar ? (
          <img
            width={48}
            height={48}
            src={API_DOMAIN`/user/` + user._id + `/avatar?f=` + user.avatar}
            alt={user.first_name}
            className={
              'object-center object-cover rounded-full overflow-hidden w-12 h-12'
            }
          />
        ) : (
          <div className={'w-full h-full rounded-full bg-gray-200'}></div>
        )}
      </div>
      <div className="flex flex-col">
        <small className={'text-xs font-semibold text-gray-500'}>
          {user._id}
        </small>
        <p className={'font-semibold'}>
          {user.first_name} {user.last_name}
        </p>
        <p className={'text-sm'}>
          {user.age} - {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserItem;
