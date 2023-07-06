import { z } from 'zod';
import { searchQueryUserSchema } from '@mw/zod-validator/schema/user-api.validation';
import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { API_DOMAIN } from '../../helper/domain';
import { UserModel } from '@mw/data-model';
import { isEmptyObject } from '@mw/fn';

type ListUserApiProps = z.infer<typeof searchQueryUserSchema>;
export const useListUsers = (props: ListUserApiProps) => {
  return useQuery({
    queryKey: ['list-users', props.query, props.find_by, props.find_option],
    queryFn: () => {
      const hasQuerySearch = !isEmptyObject(props);
      const searchQuery = new URLSearchParams();
      if (hasQuerySearch) {
        Object.keys(props).forEach((field) => {
          const val = props[field as keyof typeof props];
          if (val) {
            searchQuery.set(field, val);
          }
        });
      }

      return ky
        .get(
          API_DOMAIN`user` +
            (hasQuerySearch ? `?${searchQuery.toString()}` : '')
        )
        .json<{ data: UserModel[] }>();
    },
  });
};
