import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScheduleBaseSchema } from '../../../shared/zod/schedule.schema';

const Page = () => {
  const { register, handleSubmit, reset } = useForm<
    z.infer<typeof ScheduleBaseSchema>
  >({
    resolver: zodResolver(ScheduleBaseSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: z.infer<typeof ScheduleBaseSchema>) => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          {...register('name')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="from_date"
        >
          From Date
        </label>
        <input
          {...register('from_date')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="from_date"
          type="date"
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="to_date"
        >
          To Date
        </label>
        <input
          {...register('to_date')}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="to_date"
          type="date"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Create Schedule
        </button>
      </div>
    </form>
  );
};

export default Page;
