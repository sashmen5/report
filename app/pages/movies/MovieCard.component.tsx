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
import { keyBy } from '../../../shared/utils';
import { refreshMovie } from '../../entities/media-manager';
import { tmdbEntity } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';
import type { MovieSchema } from '../../models';
import TomatoImg from './fresh-tomamot.png';
import ImdbImg from './imdb-mini.png';

interface Props {
  movie: MovieSchema;
  onClick: () => void;
}

const MovieCard: FC<Props> = ({ movie: d, onClick: setActiveMovieId }) => {
  const [open, setOpen] = useState(false);
  const route = useRouter();

  const byRatings = keyBy(d.ratings ?? [], 'source');

  return (
    <MediaCard className={'relative gap-0'} key={d.id} onClick={() => setActiveMovieId()}>
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
              onClick={async e => {
                e.stopPropagation();
                await refreshMovie({ data: { id: d.id } });
                await route.invalidate();
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
      <div className={'grid grid-cols-2 grid-rows-[20px] pb-1 pl-0.5 pt-1.5 text-sm font-bold'}>
        {byRatings['imdb'] && (
          <div className={'mx-auto inline-flex w-full items-center gap-1'}>
            <img src={ImdbImg} alt="Tomato" />
            <div>{byRatings['imdb']?.value.split('/').at(0)}</div>
          </div>
        )}
        {byRatings['rotten_tomatoes'] && (
          <div className={'mx-auto inline-flex w-full items-center gap-1'}>
            <img src={TomatoImg} alt="Tomato" />
            <div>{byRatings['rotten_tomatoes']?.value}</div>
          </div>
        )}
      </div>
      <div>
        <MediaTitle className={'break-words'}>{d.title}</MediaTitle>
        <MediaDescription>{formatDate(d.release_date)}</MediaDescription>
      </div>
    </MediaCard>
  );
};

export { MovieCard };
