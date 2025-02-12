import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { SeasonSerializable, SeasonStatus } from '../../models/season.schema';
import { mediaManagerService } from '../media-manager';
import { WatchedEpisodePostParams, seasonService } from './service';

const getSeasonStatus = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: { serieId: number }) => d)
  .handler(async ({ data }) => {
    const seasonStatuses = (await seasonService.getBySerieId(data.serieId)) ?? [];
    return { seasonStatuses: seasonStatuses as SeasonSerializable[] };
  });

const getSeasons = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: { serieId: number }) => d)
  .handler(async ({ data }) => {
    const seasons: TMDB.Season[] = (await mediaManagerService.getSeasonsFromApi(data.serieId)) ?? [];
    return { seasons };
  });

const watchEpisode = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: WatchedEpisodePostParams) => d)
  .handler(async ({ data }) => {
    await seasonService.watchSerie(data);

    return { message: 'Watched success' };
  });

const dewatchEpisode = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: WatchedEpisodePostParams) => d)
  .handler(async ({ data }) => {
    await seasonService.dewatchEpisode(data);

    return { message: 'Watched success' };
  });

export { getSeasonStatus, getSeasons, watchEpisode, dewatchEpisode };
