import { FC, useState } from 'react';

import { Button } from '@sashmen5/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@sashmen5/components';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { formatDate } from 'app/lib/date-utils';
import { Check, Eye } from 'lucide-react';

import { dewatchEpisode, watchEpisode } from '../../entities/season';

const Route = getRouteApi('/_authed/seasons/$serieId');

const SeriePage: FC = () => {
  const router = useRouter();
  const data = Route.useLoaderData();

  const { serie, seasonsStatus } = data;

  const seasons = data.seasons
    .filter(d => d.season_number !== 0)
    .sort((a, b) => a.season_number - b.season_number);

  const [selectedSeason, setSelectedSeason] = useState(seasons[0].season_number);
  const currentSeason = seasons.find(d => d.season_number === selectedSeason);

  const episodes = seasons.find(d => d.season_number === selectedSeason)?.episodes || [];

  const isWatchedEpisode = (seasonId: number, episodeId: number) => {
    const season = seasonsStatus.seasonStatuses.find(el => el.id === seasonId);
    if (!season) {
      return false;
    }

    const isWatched = season.episodes?.[episodeId];
    console.log(isWatched);
    return Boolean(isWatched);
  };

  console.log(seasonsStatus.seasonStatuses);

  return (
    <div className={'space-y-4 py-4'}>
      <div className={'flex flex-wrap gap-x-3 gap-y-2'}>
        {seasons.map((d, i) => (
          <Button
            size={'sm'}
            key={d.id}
            variant={d.season_number === selectedSeason ? 'default' : 'secondary'}
            className={'px-4 py-1 md:h-auto'}
            onClick={() => setSelectedSeason(d.season_number)}
          >
            {d.season_number}
          </Button>
        ))}
      </div>
      <div className={'rounded-md border'}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px] text-center">#</TableHead>
              <TableHead className="w-[100px] md:w-[120px]">Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[50px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {episodes.map(d => (
              <TableRow key={d.id}>
                <TableCell className="px-2 text-center font-medium">{d.episode_number}</TableCell>
                <TableCell>{formatDate(d.air_date)}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell className={'flex-center'}>
                  {isWatchedEpisode(currentSeason!.id, d.id) ? (
                    <Button
                      size={'icon'}
                      variant={'outline'}
                      className={'[&_svg]:size-6'}
                      onClick={async () => {
                        await dewatchEpisode({
                          data: { serieId: serie!.id, seasonId: currentSeason!.id, episodeId: d.id },
                        });

                        router.invalidate();
                      }}
                    >
                      <Check className={'text-success size-5'} />
                    </Button>
                  ) : (
                    <Button
                      size={'icon'}
                      variant={'outline'}
                      className={'[&_svg]:size-6'}
                      onClick={async () => {
                        await watchEpisode({
                          data: { serieId: serie!.id, seasonId: currentSeason!.id, episodeId: d.id },
                        });

                        router.invalidate();
                      }}
                    >
                      <Eye className={'size-5'} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export { SeriePage };
