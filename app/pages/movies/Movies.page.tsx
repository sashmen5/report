import { FC, useMemo, useState } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  ToggleGroup,
  ToggleGroupItem,
  cn,
} from '@sashmen5/components';
import { useCopyToClipboard } from '@sashmen5/hooks';
import { ReportModal } from '@sashmen5/widgets';
import { getRouteApi } from '@tanstack/react-router';
import {
  CalendarArrowDown,
  CalendarArrowUp,
  Check,
  Clipboard,
  Monitor,
  Search,
  Smartphone,
  Star,
  Tablet,
} from 'lucide-react';

import { tmdbEntity } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';
import { MovieCard } from './MovieCard.component';
import { ReportMovieStatus } from './ReportMovieStatus.component';

const Route = getRouteApi('/_authed/movies');

export enum MovieStatus {
  ADDED = 'added',
  WATCHED = 'watched',
  REMOVED = 'removed',
  FAVORITE = 'favorite',
}

const movieStatusLabels: Record<MovieStatus, string> = {
  [MovieStatus.ADDED]: 'For future',
  [MovieStatus.WATCHED]: 'Watched',
  [MovieStatus.REMOVED]: 'Removed',
  [MovieStatus.FAVORITE]: 'Favorite',
};

const SORT_TYPE = {
  dateup: 'dateup',
  datedown: 'datedown',
  rating: 'rating',
} as const;

type SortType = keyof typeof SORT_TYPE;

const getMovieStatusLabel = (status: MovieStatus) => movieStatusLabels[status];
const statusOrder = [MovieStatus.ADDED, MovieStatus.WATCHED, MovieStatus.REMOVED, MovieStatus.FAVORITE];

const MoviesPage: FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<MovieStatus>(MovieStatus.ADDED);
  const [activeMovieId, setActiveMovieId] = useState<{ id: number; status: string } | undefined>();
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState<SortType | undefined>();
  const loaderdata = Route.useLoaderData();

  console.log({ loaderdata, useLoaderData: Route.useLoaderData, Route });

  const { movies, collection } = loaderdata;
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const byIds = useMemo(() => {
    const res: Record<number, TMDB.Movie> = {};
    movies?.movies?.forEach(d => (res[d.id] = d));
    return res;
  }, [movies.movies]);

  const activeMovie = typeof activeMovieId !== 'undefined' ? byIds[activeMovieId.id] : undefined;
  const lowerSearch = search.toLowerCase();
  const movieIds =
    collection.collection?.movies
      .map(d => ({ id: d.id, status: d.statuses[d.statuses.length - 1] }))
      .filter(d => d.status !== undefined)
      .filter(d => d.status.name === selectedStatus)
      .filter(d => {
        if (!search) {
          return true;
        }
        const movie = byIds[d.id];
        if (!movie) {
          return false;
        }
        return (
          byIds[d.id].title?.toLowerCase().includes(lowerSearch) ||
          byIds[d.id].original_title?.toLowerCase().includes(lowerSearch) ||
          false
        );
      })
      .sort((a, b) => {
        const aD = byIds[a.id];
        const bD = byIds[b.id];

        if (!sortType) {
          return b.status.date - a.status.date;
        }

        if (sortType === 'rating') {
          if (!bD.vote_average) return -1;
          if (!aD.vote_average) return 1;
          return bD.vote_average - aD.vote_average;
        }

        const aTime = aD.release_date;
        const bTime = bD.release_date;

        if (!aTime) return 1;
        if (!bTime) return -1;

        if (sortType === 'dateup') {
          return new Date(aTime).getTime() - new Date(bTime).getTime();
        }

        if (sortType === 'datedown') {
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        }

        return b.status.date - a.status.date;
      }) ?? [];

  const handleChangeSearch = (value: string) => {
    setSearch(value);
  };

  const movies2 = movieIds.map(id => byIds[id.id]);
  console.log({ movies2: movies2 });

  return (
    <>
      <div className={'py-4'}>
        <div className={'flex flex-col gap-5'}>
          <div className={'flex gap-3'}>
            <div className="relative grow">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => handleChangeSearch(e.target.value)}
                placeholder="Search"
                className="pl-8"
              />
            </div>
            <div className="items-center gap-1.5 rounded-md border p-[2px] shadow-none lg:flex">
              <ToggleGroup
                type="single"
                style={{ '--toggle-size': '34px' }}
                onValueChange={value => {
                  setSortType(value as SortType);
                }}
              >
                <ToggleGroupItem
                  value="datedown"
                  className="h-[var(--toggle-size)] w-[var(--toggle-size)] min-w-0 rounded-sm p-0"
                  title="DateDown"
                >
                  <CalendarArrowDown className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dateup"
                  className="h-[var(--toggle-size)] w-[var(--toggle-size)] min-w-0 rounded-sm p-0"
                  title="DateUp"
                >
                  <CalendarArrowUp className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="rating"
                  className="h-[var(--toggle-size)] w-[var(--toggle-size)] min-w-0 rounded-sm p-0"
                  title="Rating"
                >
                  <Star className="h-3.5 w-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div className={'-mt-3 flex flex-wrap gap-2'}>
            {statusOrder.map(status => (
              <Button
                size={'sm'}
                key={status}
                variant={selectedStatus === status ? 'default' : 'secondary'}
                onClick={() => setSelectedStatus(status)}
                className={'h-auto px-2 py-1'}
              >
                {getMovieStatusLabel(status)}
              </Button>
            ))}
          </div>

          <div className={'@container'}>
            <div className={'grid gap-5 @xs:grid-cols-3 @sm:grid-cols-3 @md:grid-cols-4'}>
              {movieIds?.map((id, index) => {
                const d = byIds[id.id];
                if (!d) {
                  return null;
                }

                return (
                  <MovieCard
                    key={d.id}
                    movie={d}
                    onClick={() => setActiveMovieId({ id: id.id, status: id.status.name })}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ReportModal
        open={Boolean(activeMovieId)}
        onOpenChange={() => setActiveMovieId(undefined)}
        title={
          <div className={'grid grid-cols-[auto_40px] gap-x-3 gap-y-2'}>
            <div>{activeMovie?.original_title}</div>
            <Button
              size={'icon'}
              variant={'outline'}
              className={'group ml-auto size-8 md:size-6'}
              onClick={() => copyToClipboard(activeMovie?.original_title ?? '')}
            >
              {isCopied ? (
                <Check className={'text-muted-foreground'} />
              ) : (
                <Clipboard className={'text-muted-foreground'} />
              )}
            </Button>
            {activeMovie?.original_title !== activeMovie?.title && (
              <>
                <div className={'text-sm text-muted-foreground'}>{activeMovie?.title}</div>
                <Button
                  size={'icon'}
                  variant={'outline'}
                  className={'group ml-auto size-8 md:size-6'}
                  onClick={() => copyToClipboard(activeMovie?.title ?? '')}
                >
                  {isCopied ? (
                    <Check className={'text-muted-foreground'} />
                  ) : (
                    <Clipboard className={'text-muted-foreground'} />
                  )}
                </Button>
              </>
            )}
          </div>
        }
      >
        {activeMovie && (
          <ReportMovieStatus
            id={activeMovie.id}
            orders={statusOrder}
            defaultStatus={activeMovieId?.status ?? ''}
            onStatusChange={() => setActiveMovieId(undefined)}
          />
        )}
      </ReportModal>
    </>
  );
};

export { MoviesPage };
