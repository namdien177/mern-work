import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { API_DOMAIN } from '../../shared/helper/domain';
import { BlogModel } from '@mw/data-model';
import dayjs from 'dayjs';
import useDebounce from '../../shared/hooks/use-debounce';

const Page = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [afterDate, setAfterDate] = useState<string | null>(
    searchParams.get('after')
  );
  const [searchValue, setSearchValue] = useState<string | null>(
    searchParams.get('query')
  );
  const [debounceValue, debouncing] = useDebounce(searchValue);

  const { data, isLoading } = useQuery({
    queryKey: ['list-blog', debounceValue, afterDate],
    queryFn: () => {
      let sf = '';
      const params = new URLSearchParams();
      if (debounceValue?.trim()) {
        params.set('query', debounceValue?.trim());
        sf = '?';
      }
      if (afterDate?.trim()) {
        params.set('after', afterDate?.trim());
        sf = '?';
      }

      let domain = API_DOMAIN`/blog`;
      if (sf) {
        domain += sf + params.toString();
      }

      return ky.get(domain).json<{ data: BlogModel[] }>();
    },
  });

  const findMore = (lastDate: string) => {
    if (lastDate) {
      console.log(lastDate);
      setAfterDate(lastDate);

      const newParams = new URLSearchParams();
      searchParams.forEach((value, key) => {
        newParams.set(key, value);
      });
      newParams.set('after', lastDate);
      setSearchParams(newParams);
    }
  };

  const search = () => {
    if (!searchValue || searchValue === searchParams.get('query')) {
      return;
    }
    const newParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      newParams.set(key, value);
    });
    newParams.set('query', searchValue);
    setSearchParams(newParams);
  };

  return (
    <div className={'container mx-auto p-8'}>
      <div className="space-x-2 flex">
        <input
          defaultValue={searchValue ?? ''}
          type="text"
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          className={'flex-1 border rounded p-2'}
        />

        <button onClick={() => search()} className={'border py-2 px-4'}>
          Search
        </button>
      </div>
      {(debouncing || isLoading) && <>Loading...</>}
      {data?.data && !isLoading && (
        <>
          <hr className={'my-8'} />

          {data.data.map((blog) => (
            <div key={blog._id} className="flex p-8 border rounded flex-col">
              <span className={'text-xs text-gray-600'}>{blog._id}</span>
              <p>{blog.title}</p>
              <hr className={'my-2'} />
              <p className={'overflow-hidden max-h-20'}>{blog.content}</p>
              <p className={'text-right text-gray-600'}>
                {dayjs(blog.created_at).toDate().toDateString()}
              </p>
            </div>
          ))}

          <hr className={'my-8'} />
          {data.data.length > 1 && (
            <button onClick={() => findMore(data.data.at(-1)!.created_at)}>
              Next Page
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
