import { ScheduleModel } from '@mw/data-model';
import ScheduleItem from './_components/schedule-item';

const schedules: ScheduleModel[] = [
  { _id: '1', name: 'Meeting', from_date: '2023-07-07', to_date: '2023-07-08' },
  {
    _id: '2',
    name: 'Conference',
    from_date: '2023-07-09',
    to_date: '2023-07-10',
  },
];

const Page = () => {
  const handleEdit = (id: string) => {
    // handle edit logic here
  };

  const handleDelete = (id: string) => {
    // handle delete logic here
  };

  return (
    <ul className="list-none p-0">
      {schedules.map((schedule) => (
        <ScheduleItem
          schedule={schedule}
          key={schedule._id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
};

export default Page;
