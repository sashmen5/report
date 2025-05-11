import { createFileRoute } from '@tanstack/react-router';

import { getCollection } from '../../entities/collection';
import { SerieAtom, getSeries } from '../../entities/serie';
import { SeriesPage } from '../../pages/series';

export const Route = createFileRoute('/_authed/series')({
  loader: async () => {
    //rewrite with promise.all
    const [series, collection] = await Promise.all([getSeries(), getCollection()]);

    return { series, collection };
  },
  validateSearch: ({ status }) => {
    return {
      status: SerieAtom.isStatus(status) ? status : SerieAtom.DefaultStatus,
    };
  },
  component: SeriesPage,
});
