import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useMutateCreateSchedule } from '../../../shared/api-hook/schedule/schedule.api';
import {
  clientRefineScheduleDate,
  clientScheduleBaseSchema,
} from '../../../shared/zod/schedule';

const createSchedule = clientScheduleBaseSchema.superRefine(
  clientRefineScheduleDate
);

const Page = () => {
  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof clientScheduleBaseSchema>
  >({
    resolver: zodResolver(createSchedule),
    mode: 'onBlur',
  });

  const navigate = useNavigate();
  const { mutateAsync, isLoading, error } = useMutateCreateSchedule();

  const onSubmit = async (data: z.infer<typeof clientScheduleBaseSchema>) => {
    console.log(data);
    await mutateAsync({
      ...data,
      to_date: data.to_date ? new Date(data.to_date).toISOString() : undefined,
      from_date: new Date(data.from_date).toISOString(),
    });
    navigate('/schedule');
  };

  const onCancel = () => {
    navigate('/schedule');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container max-w-md p-8 flex flex-col space-y-4 mx-auto"
    >
      <div>
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
        {formState.errors.name && (
          <p className={'text-sm text-red-600'}>
            {formState.errors.name.message}
          </p>
        )}
      </div>
      <div>
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
        {formState.errors.from_date && (
          <p className={'text-sm text-red-600'}>
            {formState.errors.from_date.message}
          </p>
        )}
      </div>
      <div>
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
        {formState.errors.to_date && (
          <p className={'text-sm text-red-600'}>
            {formState.errors.to_date.message}
          </p>
        )}
      </div>

      <hr />

      <div className="flex items-center justify-end space-x-2">
        <button
          className="border border-transparent hover:bg-red-200 text-red-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          disabled={isLoading || !formState.isValid}
          className="bg-blue-500 disabled:bg-slate-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Create Schedule
        </button>
      </div>
      {!!error && <span className={'text-red-600'}>Data submit error</span>}
    </form>
  );
};

export default Page;
