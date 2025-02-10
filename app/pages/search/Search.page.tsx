import { FC, useCallback, useMemo, useState } from 'react';

import { Button, Input } from '@sashmen5/components';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import debounce from 'lodash.debounce';
import { Plus, Search } from 'lucide-react';

import { addMovie } from '../../entities/media-manager';
import { tmdbService } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';

const Route = getRouteApi('/_authed/search');

const SearchPage: FC = () => {
  const navigate = Route.useNavigate();
  const { query } = Route.useSearch();
  const [value, setValue] = useState(query);
  const { search, collection } = Route.useLoaderData();
  const router = useRouter();

  const moviesByIds = (function () {
    const res: Record<number, boolean> = {};
    collection?.movies?.forEach(d => {
      if (res[d.id]) {
        console.error('Duplicate movie id', d.id);
      }
      res[d.id] = true;
    });
    return res;
  })();

  console.log('[collection?.movies.length]', collection?.movies, moviesByIds);

  console.log(Object.keys(moviesByIds).length);
  console.log(Object.keys(moviesByIds).length);

  const debounceSearch = useCallback(
    debounce((value: string) => {
      console.log('Debounced called with', value);
      navigate({ search: { query: value }, replace: true });
    }, 500),
    [],
  );

  const handleChangeSearch = (value: string) => {
    setValue(value);
    debounceSearch(value);
  };

  const handleOnAdd = async (movieId: number) => {
    console.log('Add');
    const res = await addMovie({ data: { id: movieId } });
    console.log(res);
    //TODO: Optimisitc update
    router.invalidate();
  };

  return (
    <div className={'py-4'}>
      <div className={'flex flex-col gap-5'}>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={e => handleChangeSearch(e.target.value)}
            placeholder="Search"
            className="pl-8"
          />
        </div>

        <div className={'@container'}>
          <div className={'grid gap-5 @xs:grid-cols-3 @sm:grid-cols-3 @md:grid-cols-4'}>
            {search.results
              ?.filter(d => d.media_type === 'movie')
              .map((d, index) => {
                return (
                  <MediaCard key={d.id}>
                    <MediaImg
                      loading={'lazy'}
                      className={'aspect-[6/9]'}
                      src={tmdbService.buildPosterImgPath(d.poster_path ?? d.backdrop_path ?? '', '400')}
                    />
                    <div className={'flex justify-between gap-3 align-top'}>
                      <div className={'space-y-2'}>
                        <MediaTitle>{d.title}</MediaTitle>
                        <MediaDescription>{formatDate(d.release_date)}</MediaDescription>
                      </div>
                      {!moviesByIds[d.id] && (
                        <Button
                          size={'icon'}
                          variant={'outline'}
                          className={'mr-1 size-8 shrink-0'}
                          onClick={() => handleOnAdd(d.id)}
                        >
                          <Plus />
                        </Button>
                      )}
                    </div>
                  </MediaCard>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { SearchPage };
