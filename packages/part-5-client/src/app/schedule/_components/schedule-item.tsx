import { ScheduleModel } from '@mw/data-model';
import { useMutateDeleteSchedule } from '../../../shared/api-hook/schedule/schedule.api';
import { useNavigate } from 'react-router-dom';

type ItemProps = {
  schedule: ScheduleModel;
  onDeleted?: () => void;
};

const ScheduleItem = ({ schedule, onDeleted }: ItemProps) => {
  const navigate = useNavigate();
  const { mutateAsync: mutateDelete, isLoading } = useMutateDeleteSchedule();

  const onDelete = async (id: string) => {
    await mutateDelete(id);
    onDeleted && onDeleted();
  };

  return (
    <li
      key={schedule._id}
      className="border hover:bg-slate-50 rounded border-gray-200 p-4 flex"
    >
      <div className="flex-1 flex flex-col">
        <div className="font-bold">{schedule.name}</div>
        <div>From: {schedule.from_date}</div>
        <div>To: {schedule.to_date}</div>
      </div>
      <div className="flex items-center justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => navigate(`/schedule/${schedule._id}/edit`)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onDelete && onDelete(schedule._id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default ScheduleItem;
