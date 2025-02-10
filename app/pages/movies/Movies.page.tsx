import { FC, useMemo, useState } from 'react';

import { Button, Input, ToggleGroup, ToggleGroupItem } from '@sashmen5/components';
import { useCopyToClipboard } from '@sashmen5/hooks';
import { ReportModal } from '@sashmen5/widgets';
import { getRouteApi } from '@tanstack/react-router';
import { Check, Clipboard, Search } from 'lucide-react';

import { tmdbService } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';
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

const getMovieStatusLabel = (status: MovieStatus) => movieStatusLabels[status];
const statusOrder = [MovieStatus.ADDED, MovieStatus.WATCHED, MovieStatus.REMOVED, MovieStatus.FAVORITE];

const MoviesPage: FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<MovieStatus>(MovieStatus.ADDED);
  const [activeMovieId, setActiveMovieId] = useState<{ id: number; status: string } | undefined>();
  const [search, setSearch] = useState('');
  const { movies, collection } = Route.useLoaderData();
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const moviesByIds = useMemo(() => {
    const res: Record<number, (typeof movies)['movies'][number]> = {};
    movies?.movies?.forEach(d => (res[d.id] = d));
    return res;
  }, [movies.movies]);

  const activeMovie = typeof activeMovieId !== 'undefined' ? moviesByIds[activeMovieId.id] : undefined;

  const movieIds = collection.collection?.movies
    .map(d => ({ id: d.id, status: d.statuses[d.statuses.length - 1] }))
    .filter(d => d.status !== undefined)
    .filter(d => d.status.name === selectedStatus)
    .sort((a, b) => b.status.date - a.status.date);

  const handleChangeSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <>
      <div className={'py-4'}>
        <div className={'flex flex-col gap-5'}>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => handleChangeSearch(e.target.value)}
              placeholder="Search"
              className="pl-8"
            />
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
                const d = moviesByIds[id.id];
                return (
                  <MediaCard
                    key={d.id}
                    onClick={() => setActiveMovieId({ id: id.id, status: id.status.name })}
                  >
                    <MediaImg
                      loading={'lazy'}
                      className={'aspect-[6/9]'}
                      src={tmdbService.buildPosterImgPath(d.poster_path ?? d.backdrop_path ?? '', '400')}
                    />
                    <div>
                      <MediaTitle>{d.title}</MediaTitle>
                      <MediaDescription>{formatDate(d.release_date)}</MediaDescription>
                    </div>
                  </MediaCard>
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
