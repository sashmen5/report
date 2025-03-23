import { FC, useCallback, useEffect, useState } from 'react';

import { Badge, Button, Input, cn } from '@sashmen5/components';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import debounce from 'lodash.debounce';
import { Plus, Search } from 'lucide-react';

import { getCollection } from '../../entities/collection';
import { addMovie, addSerie } from '../../entities/media-manager';
import { fetchSearch, tmdbEntity } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';
import { Collection } from '../../models/collecton.schema';

const Route = getRouteApi('/_authed/search');

const SearchPage: FC = () => {
  const navigate = Route.useNavigate();
  const { query } = Route.useSearch();
  const [value, setValue] = useState(query);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [search, setSearch] = useState<TMDB.MultiSearchResult[]>([]);

  const reFetch = () => {
    getCollection().then(res => {
      if (res.collection) {
        setCollection(res.collection);
      }
    });
  };

  useEffect(() => reFetch(), []);

  useEffect(() => {
    if (!query) {
      setSearch([]);
    }
    fetchSearch({ data: { query: query ?? '' } }).then(res => setSearch(res.search.results ?? []));
  }, [query]);

  // const { search, collection } = Route.useLoaderData();

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
    reFetch();
    //TODO: Optimisitc update
  };

  const handleOnAddSerie = async (movieId: number) => {
    console.log('Add');
    const res = await addSerie({ data: { id: movieId } });
    console.log(res);
    reFetch();
    //TODO: Optimisitc update
  };

  return (
    <div className={'py-4'}>
      <div className={'flex flex-col gap-5'}>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={value}
            onChange={e => handleChangeSearch(e.target.value)}
            placeholder="Search"
            className="pl-8"
          />
        </div>

        <div className={'@container'}>
          <div className={'grid gap-3 @xs:grid-cols-2 @md:grid-cols-4'}>
            {search
              ?.filter(d => d.media_type === 'movie' || d.media_type === 'tv')
              ?.sort((a, b) => {
                const aTime = a.release_date ?? a.first_air_date;
                const bTime = b.release_date ?? b.first_air_date;
                // Handle cases where either date is undefined or null
                if (!aTime) return 1; // a goes after b
                if (!bTime) return -1; // b goes after a

                return new Date(bTime).getTime() - new Date(aTime).getTime();
              })
              .map(d => {
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
                      className={'aspect-[105/150]'}
                      src={tmdbEntity.buildPosterImgPath(d.poster_path ?? d.backdrop_path ?? '', '400')}
                    />
                    <div className={'relative flex justify-between gap-3 p-3 align-top'}>
                      <div className={'grow space-y-1'}>
                        <div className={'flex justify-between gap-2'}>
                          <MediaTitle className={'line-clamp-3'} style={{ wordBreak: 'break-word' }}>
                            {d.title ?? d.name ?? d.original_title ?? d.original_title}
                          </MediaTitle>
                          {d.media_type === 'movie' && !moviesByIds[d.id] && (
                            <div
                              className={cn(
                                'box absolute right-4 top-1 -translate-y-3/4 rounded-xl bg-background px-1.5 pb-0 pt-1.5',
                              )}
                            >
                              <Button
                                size={'icon'}
                                variant={'outline'}
                                className={'size-8 shrink-0'}
                                onClick={() => handleOnAdd(d.id)}
                              >
                                <Plus className={'stroke-muted-foreground'} />
                              </Button>
                            </div>
                          )}

                          {d.media_type === 'tv' && !seriesByIds[d.id] && (
                            <div
                              className={cn(
                                'box absolute right-4 top-1 -translate-y-3/4 rounded-xl bg-background px-1.5 pb-0 pt-1.5',
                              )}
                            >
                              <Button
                                size={'icon'}
                                variant={'outline'}
                                className={'mr-1 size-8 shrink-0'}
                                onClick={() => handleOnAddSerie(d.id)}
                              >
                                <Plus className={'stroke-muted-foreground'} />
                              </Button>
                            </div>
                          )}
                        </div>
                        <Badge
                          className={'-ml-1 truncate'}
                          variant={d.media_type === 'movie' ? 'outline' : 'secondary'}
                        >
                          {d.media_type}
                        </Badge>
                        <MediaDescription>{formatDate(d.release_date ?? d.first_air_date)}</MediaDescription>
                      </div>
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
