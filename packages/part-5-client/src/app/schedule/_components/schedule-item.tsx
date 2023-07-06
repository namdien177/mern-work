import { ScheduleModel } from '@mw/data-model';

type ItemProps = {
  schedule: ScheduleModel;
  onEdit?: (id: string) => unknown;
  onDelete?: (id: string) => unknown;
};

const ScheduleItem = ({ schedule, onDelete, onEdit }: ItemProps) => {
  return (
    <li key={schedule._id} className="border-b border-gray-200 p-2">
      <div className="font-bold">{schedule.name}</div>
      <div>From: {schedule.from_date}</div>
      <div>To: {schedule.to_date}</div>
      <div className="flex items-center justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => onEdit && onEdit(schedule._id)}
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
