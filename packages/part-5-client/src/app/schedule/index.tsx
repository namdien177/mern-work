import ScheduleItem from './_components/schedule-item';
import { Link } from 'react-router-dom';
import { useQuerySchedule } from '../../shared/api-hook/schedule/schedule.api';

const Page = () => {
  const { data, isLoading, refetch } = useQuerySchedule();

  return (
    <div className={'container flex flex-col mx-auto p-8'}>
      <div className="flex">
        <Link
          to={'/schedule/create'}
          className={'px-4 py-2 font-semibold rounded bg-green-600 text-white'}
        >
          Create
        </Link>
      </div>

      <hr className={'my-8'} />

      {isLoading && <>Loading...</>}

      {data?.data && !isLoading && (
        <ul className="list-none p-0 space-y-2">
          {data.data.map((schedule) => (
            <ScheduleItem
              schedule={schedule}
              onDeleted={refetch}
              key={schedule._id}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
