import { createFileRoute } from '@tanstack/react-router';

import { getSeasonStatus, getSeasons } from '../../../entities/season';
import { getSerie } from '../../../entities/serie';
import { SeriePage } from '../../../pages/serie';

export const Route = createFileRoute('/_authed/seasons/$serieId')({
  loader: async ctx => {
    const [seasonsStatus, serie, seasons] = await Promise.all([
      getSeasonStatus({ data: { serieId: parseInt(ctx.params.serieId) } }),
      getSerie({ data: { id: parseInt(ctx.params.serieId) } }),
      getSeasons({ data: { serieId: parseInt(ctx.params.serieId) } }),
    ]);
    return { seasonsStatus, ...seasons, ...serie };
  },
  component: SeriePage,
});
