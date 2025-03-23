import { FC, useMemo, useState } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  cn,
} from '@sashmen5/components';
import { useCopyToClipboard } from '@sashmen5/hooks';
import { ReportModal } from '@sashmen5/widgets';
import { Link, getRouteApi } from '@tanstack/react-router';
import { Check, Clipboard, Search } from 'lucide-react';

import { tmdbEntity } from '../../entities/tmdb';
import { MediaCard, MediaDescription, MediaImg, MediaTitle } from '../../features';
import { formatDate } from '../../lib/date-utils';
import { ReportSerieStatus } from './ReportSerieStatus.component';
import { SerieCard } from './SerieCard.component';

const Route = getRouteApi('/_authed/series');

export enum SerieStatus {
  InProcess = 'watching',
  Finished = 'finished',
  ForFuture = 'added',
  WaitingForSeason = 'waiting',
  Removed = 'removed',
  Later = 'later',
}

const statusLabels: Record<SerieStatus, string> = {
  [SerieStatus.InProcess]: 'In process',
  [SerieStatus.Finished]: 'Finished',
  [SerieStatus.ForFuture]: 'For future',
  [SerieStatus.WaitingForSeason]: 'Waiting for season',
  [SerieStatus.Removed]: 'Removed',
  [SerieStatus.Later]: 'Later',
};

const getStatusLabel = (status: SerieStatus) => statusLabels[status];
const statusOrder = [
  SerieStatus.InProcess,
  SerieStatus.ForFuture,
  SerieStatus.WaitingForSeason,
  SerieStatus.Finished,
  SerieStatus.Removed,
  SerieStatus.Later,
];

const SeriesPage: FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<SerieStatus>(SerieStatus.InProcess);
  const [activeId, setActiveId] = useState<{ id: number; status: string } | undefined>();
  const [search, setSearch] = useState('');
  const { series, collection } = Route.useLoaderData();
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const byIds = useMemo(() => {
    const res: Record<number, (typeof series)['series'][number]> = {};
    series?.series?.forEach(d => (res[d.id] = d));
    return res;
  }, [series?.series]);

  const active = typeof activeId !== 'undefined' ? byIds[activeId.id] : undefined;
  const lowerSearch = search.toLowerCase();
  const ids = collection.collection?.series
    .map(d => ({ id: d.id, status: d.statuses[d.statuses.length - 1] }))
    .filter(d => d.status !== undefined)
    .filter(d => d.status.name === selectedStatus)
    .filter(d => {
      if (!search) {
        return true;
      }
      const serie = byIds[d.id];
      if (!serie) {
        return false;
      }
      return (
        byIds[d.id].name?.toLowerCase().includes(lowerSearch) ||
        byIds[d.id].originalName?.toLowerCase().includes(lowerSearch)
      );
    })
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
                {getStatusLabel(status)}
                <span
                  className={cn({
                    'text-muted-foreground': selectedStatus !== status,
                  })}
                >
                  {collection.counts?.series[status]}
                </span>
              </Button>
            ))}
          </div>

          <div className={'@container'}>
            <div className={'grid grid-cols-1 gap-5 @xs:grid-cols-2 @md:grid-cols-4'}>
              {ids?.map((id, index) => {
                const d = byIds[id.id];
                if (!d) {
                  return null;
                }

                return (
                  <SerieCard
                    key={index}
                    serie={d}
                    onClick={() => setActiveId({ id: id.id, status: id.status.name })}
                    preload={selectedStatus === SerieStatus.InProcess ? 'viewport' : false}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ReportModal
        open={Boolean(activeId)}
        onOpenChange={() => setActiveId(undefined)}
        title={
          <div className={'grid grid-cols-[auto_40px] gap-x-3 gap-y-2'}>
            <div>{active?.originalName}</div>
            <Button
              size={'icon'}
              variant={'outline'}
              className={'group ml-auto size-8 md:size-6'}
              onClick={() => copyToClipboard(active?.originalName ?? '')}
            >
              {isCopied ? (
                <Check className={'text-muted-foreground'} />
              ) : (
                <Clipboard className={'text-muted-foreground'} />
              )}
            </Button>
          </div>
        }
      >
        {active && (
          <ReportSerieStatus
            id={active.id}
            orders={statusOrder}
            defaultStatus={activeId?.status ?? ''}
            onStatusChange={() => setActiveId(undefined)}
          />
        )}
      </ReportModal>
    </>
  );
};

export { SeriesPage };
