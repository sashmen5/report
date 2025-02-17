import { ComponentProps, FC, useState } from 'react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from '@sashmen5/components';
import { Link } from '@tanstack/react-router';
import { RefreshCcw } from 'lucide-react';

import { PendingRoundedIcon } from '../../../shared/components/Icons';
import { refreshSerie } from '../../entities/media-manager';
import { tmdbEntity } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';
import { Serie } from '../../models/serie.schema';

interface Props {
  serie: Serie;
  onClick: () => void;
  preload?: ComponentProps<typeof Link>['preload'];
}

const SerieCard: FC<Props> = ({ preload, onClick, serie: d }) => {
  const [open, setOpen] = useState(false);
  return (
    <MediaCard onClick={onClick} key={d.id} className={'relative gap-3'}>
      <div
        className={cn(
          'absolute inset-0 overflow-hidden rounded-2xl bg-black/10 backdrop-blur-2xl',
          'transition-opacity duration-500',
          open ? 'z-10 opacity-100' : 'z-0 opacity-0',
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
              className={'cursor-pointer pl-8'}
              onClick={e => {
                e.stopPropagation();
                refreshSerie({ data: { id: d.id } });
              }}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <RefreshCcw className="h-4 w-4" />
              </span>
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
      <div onClick={e => e.stopPropagation()} className={cn('mx-1', open ? 'z-0' : 'z-10')}>
        <Link to={'/seasons/$serieId'} params={{ serieId: d.id.toString() }} preload={preload}>
          <MediaTitle>{d.name ?? d.originalName}</MediaTitle>
        </Link>
        <MediaDescription>{formatDate(d.firstAirDate)}</MediaDescription>
      </div>
    </MediaCard>
  );
};

export { SerieCard };
