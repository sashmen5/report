import { FC, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from '@sashmen5/components';
import { useRouter } from '@tanstack/react-router';

import { PendingRoundedIcon } from '../../../shared/components/Icons';
import { refreshMovie } from '../../entities/media-manager';
import { tmdbEntity } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';

interface Props {
  movie: TMDB.Movie;
  onClick: () => void;
}

const MovieCard: FC<Props> = ({ movie: d, onClick: setActiveMovieId }) => {
  const [open, setOpen] = useState(false);
  const route = useRouter();

  return (
    <MediaCard className={'relative gap-3'} key={d.id} onClick={() => setActiveMovieId()}>
      <div
        className={cn(
          'absolute inset-0 overflow-hidden rounded-2xl bg-black/10 backdrop-blur-lg',
          'transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div className={'absolute right-0 top-0 m-2'}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            asChild
            tabIndex={0}
            className={cn(
              'outline-none',
              'fill-[rgba(255,255,255,0.4)] transition-all hover:cursor-pointer',
              'hover:fill-[rgba(255,255,255,0.8)] focus-visible:fill-[rgba(255,255,255,0.8)]',
            )}
          >
            <PendingRoundedIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align={'center'} side={'bottom'}>
            <DropdownMenuItem
              className={'cursor-pointer'}
              onClick={e => {
                e.stopPropagation();
                refreshMovie({ data: { id: d.id } });
                route.invalidate();
              }}
            >
              Refresh
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <MediaImg
        loading={'lazy'}
        className={'aspect-[6/9] rounded-2xl'}
        src={tmdbEntity.buildPosterImgPath(d.poster_path ?? d.backdrop_path ?? '', '400')}
      />
      <div>
        <MediaTitle className={'break-words'}>{d.title}</MediaTitle>
        <MediaDescription>{formatDate(d.release_date)}</MediaDescription>
      </div>
    </MediaCard>
  );
};

export { MovieCard };
