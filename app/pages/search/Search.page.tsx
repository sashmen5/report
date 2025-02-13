import { FC, useCallback, useMemo, useState } from 'react';

import { Badge, Button, Input } from '@sashmen5/components';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import debounce from 'lodash.debounce';
import { Plus, Search } from 'lucide-react';

import { addMovie, addSerie } from '../../entities/media-manager';
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
    collection?.movies?.forEach(d => (res[d.id] = true));
    return res;
  })();

  const seriesByIds = (function () {
    const res: Record<number, boolean> = {};
    collection?.series?.forEach(d => (res[d.id] = true));
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

  const handleOnAddSerie = async (movieId: number) => {
    console.log('Add');
    const res = await addSerie({ data: { id: movieId } });
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
              ?.filter(d => d.media_type === 'movie' || d.media_type === 'tv')
              .map((d, index) => {
                return (
                  <MediaCard
                    key={d.id}
                    className={'overflow-hidden'}
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, .1)',
                      border: '1px solid #e3e3e3',
                      borderRadius: '16px',
                    }}
                  >
                    <MediaImg
                      loading={'lazy'}
                      className={'aspect-[6/9]'}
                      src={tmdbService.buildPosterImgPath(d.poster_path ?? d.backdrop_path ?? '', '400')}
                    />
                    <div className={'flex justify-between gap-3 p-3 align-top'}>
                      <div className={'space-y-1'}>
                        <MediaTitle
                          className={'line-clamp-2'}
                          style={{
                            wordBreak: 'break-word',
                          }}
                        >
                          {d.title ?? d.name ?? d.original_title ?? d.original_title}
                        </MediaTitle>
                        <Badge variant={d.media_type === 'movie' ? 'outline' : 'secondary'}>
                          {d.media_type}
                        </Badge>
                        <MediaDescription>{formatDate(d.release_date ?? d.first_air_date)}</MediaDescription>
                      </div>

                      {d.media_type === 'movie' && !moviesByIds[d.id] && (
                        <Button
                          size={'icon'}
                          variant={'outline'}
                          className={'size-8 shrink-0'}
                          onClick={() => handleOnAdd(d.id)}
                        >
                          <Plus />
                        </Button>
                      )}

                      {d.media_type === 'tv' && !seriesByIds[d.id] && (
                        <Button
                          size={'icon'}
                          variant={'outline'}
                          className={'mr-1 size-8 shrink-0'}
                          onClick={() => handleOnAddSerie(d.id)}
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
