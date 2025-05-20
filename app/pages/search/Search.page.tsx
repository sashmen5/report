import { FC, useEffect, useState } from 'react';

import { Badge, Button, SearchField, cn } from '@sashmen5/components';
import { getRouteApi } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { getCollection } from '../../entities/collection';
import { addMovie, addSerie } from '../../entities/media-manager';
import { fetchSearch, tmdbEntity } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';
import { Collection } from '../../models/collecton.schema';

const Route = getRouteApi('/_authed/search');

const SearchPage: FC = () => {
  const navigate = Route.useNavigate();
  const { search: query } = Route.useSearch();
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

  const handleOnAdd = async (movieId: number) => {
    await addMovie({ data: { id: movieId } });

    reFetch();
    //TODO: Optimisitc update
  };

  const handleOnAddSerie = async (movieId: number) => {
    await addSerie({ data: { id: movieId } });
    reFetch();
    //TODO: Optimisitc update
  };

  return (
    <div className={'py-4'}>
      <div className={'flex flex-col gap-5'}>
        <SearchField delay={1_000} />

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
