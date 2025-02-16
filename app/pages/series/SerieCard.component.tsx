import { ComponentProps, FC, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from '@sashmen5/components';
import { Link } from '@tanstack/react-router';

import { PendingRoundedIcon } from '../../../shared/components/Icons';
import { refreshMovie, refreshSerie } from '../../entities/media-manager';
import { tmdbEntity } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';
import { Serie } from '../../models/serie.schema';

interface Props {
  serie: Serie;
  onClick: () => void;
  preload: ComponentProps<typeof Link>['preload'];
}

const SerieCard: FC<Props> = ({ preload, onClick, serie: d }) => {
  const [open, setOpen] = useState(false);
  return (
    <MediaCard key={d.id} onClick={onClick} className={'relative gap-3'}>
      <div
        className={cn(
          'absolute inset-0 overflow-hidden rounded-2xl bg-black/10 backdrop-blur-2xl',
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
                refreshSerie({ data: { id: d.id } });
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
        src={tmdbEntity.buildPosterImgPath(d.posterPath ?? d.backdropPath ?? '', '400')}
      />
      <div onClick={e => e.stopPropagation()}>
        <Link to={'/seasons/$serieId'} params={{ serieId: d.id.toString() }} preload={preload}>
          <MediaTitle>{d.name ?? d.originalName}</MediaTitle>
        </Link>
        <MediaDescription>{formatDate(d.firstAirDate)}</MediaDescription>
      </div>
    </MediaCard>
  );
};

export { SerieCard };
