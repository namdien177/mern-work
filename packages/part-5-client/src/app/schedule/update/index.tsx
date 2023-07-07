import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { API_DOMAIN } from '../../../shared/helper/domain';
import { ScheduleModel } from '@mw/data-model';
import UpdateForm from './_component/update-form';
import { useMutateUpdateSchedule } from '../../../shared/api-hook/schedule/schedule.api';
import { clientScheduleBaseSchema } from '../../../shared/zod/schedule';

const Page = () => {
  const navigate = useNavigate();
  const router = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['detail-schedule', router.id],
    queryFn: () =>
      ky.get(API_DOMAIN`schedule/` + router.id).json<{ data: ScheduleModel }>(),
  });

  const { mutateAsync: update, error } = useMutateUpdateSchedule();

  const onSubmit = async (
    data: z.infer<typeof clientScheduleBaseSchema> & { _id: string }
  ) => {
    await update({
      ...data,
      from_date: new Date(data.from_date).toISOString(),
      to_date: data.to_date ? new Date(data.to_date).toISOString() : undefined,
    });
    navigate('/schedule');
  };

  const onCancel = () => {
    navigate('/schedule');
  };

  return (
    <div className={'container max-w-md p-8 flex flex-col space-y-4 mx-auto'}>
      <h1>Update:</h1>
      <hr />
      {isLoading && <p>Loading...</p>}
      {data?.data && !isLoading && (
        <UpdateForm
          schedule={data.data}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
      {!!error && <span className={'text-red-600'}>Data submit error</span>}
    </div>
  );
};

export default Page;
