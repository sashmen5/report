import { createFileRoute } from '@tanstack/react-router';

import { getCollection } from '../../entities/collection';
import { getSeries } from '../../entities/serie';
import { SeriesPage } from '../../pages/series';

export const Route = createFileRoute('/_authed/series')({
  loader: async () => {
    //rewrite with promise.all
    const [series, collection] = await Promise.all([getSeries(), getCollection()]);

    return { series, collection };
  },
  component: SeriesPage,
});
