import ky from 'ky';
import { useMutation, useQuery } from '@tanstack/react-query';
import { API_DOMAIN } from '../../helper/domain';
import { z } from 'zod';
import { scheduleBaseSchema } from '@mw/zod-validator/schema/schedule.validation';
import { ScheduleModel } from '@mw/data-model';

export const useQuerySchedule = () =>
  useQuery({
    queryKey: ['list-schedule'],
    queryFn: () =>
      ky.get(API_DOMAIN`/schedule`).json<{ data: ScheduleModel[] }>(),
  });

export const useMutateCreateSchedule = () =>
  useMutation({
    mutationFn: (payload: Omit<ScheduleModel, '_id'>) =>
      ky
        .post(API_DOMAIN`/schedule`, {
          json: payload,
        })
        .json<{ data: boolean }>(),
  });

export const useMutateDeleteSchedule = () =>
  useMutation({
    mutationFn: (id: string) =>
      ky.delete(API_DOMAIN`/schedule` + `/${id}`).json<{ data: boolean }>(),
  });

export const useMutateUpdateSchedule = () =>
  useMutation({
    mutationFn: ({ _id, ...payload }: ScheduleModel) =>
      ky
        .patch(API_DOMAIN`/schedule/` + _id, {
          json: payload,
        })
        .json<{ data: boolean }>(),
  });
