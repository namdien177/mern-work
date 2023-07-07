import { ScheduleModel } from '@mw/data-model';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  clientRefineScheduleDate,
  clientScheduleBaseSchema,
} from '../../../../shared/zod/schedule';

type Props = {
  schedule: ScheduleModel;
  onSubmit: (data: z.infer<typeof updateSchema>) => unknown;
  onCancel: () => void;
};

const updateSchema = clientScheduleBaseSchema
  .extend({
    _id: z.string().min(24),
  })
  .superRefine(clientRefineScheduleDate);

export default function UpdateForm({ schedule, onSubmit, onCancel }: Props) {
  const { register, watch, handleSubmit } = useForm<
    z.infer<typeof updateSchema>
  >({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      _id: schedule._id,
      name: schedule.name,
      // a bit hacky...since date input default is quite annoying...using lib with parser will be much better
      from_date: new Date(schedule.from_date).toLocaleDateString('en-CA'),
      to_date: schedule.to_date
        ? new Date(schedule.to_date).toLocaleDateString('en-CA')
        : undefined,
    },
  });

  console.log(watch());

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          {...register('name')}
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="from_date"
          type="date"
          {...register('from_date')}
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="to_date"
          type="date"
          {...register('to_date')}
        />
      </div>
      <div className="flex items-center justify-end space-x-2">
        <button
          className="border border-transparent hover:bg-red-200 text-red-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Update Schedule
        </button>
      </div>
    </form>
  );
}
