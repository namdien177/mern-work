import { useListUsers } from '../../api/users/list-user.api';
import UserItem from '../../component/user-item';

const ListUser = () => {
  // const router =
  const { data } = useListUsers({});
  return (
    <div className={'container mx-auto px-8 flex flex-col'}>
      <div className="flex items-center">
        <h1>List Users</h1>
        <div className="flex-1"></div>
        <div className="space-x-2 flex items-center">
          {/* We can implement this in the future... */}
          <input
            className={'border py-1 px-2 rounded'}
            placeholder={'search...'}
            type="text"
          />
        </div>
      </div>
      <hr className={'my-8'} />
      <div className="flex flex-col space-y-2">
        {data &&
          data.data.map((user) => <UserItem user={user} key={user._id} />)}
      </div>
    </div>
  );
};

export default ListUser;
