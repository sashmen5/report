import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { collectionService } from './service';

const getCollection = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { id } = context.user;
    const collection = await collectionService.getByUserId(id);
    if (!collection) {
      return { error: 'Collection not found' };
    }

    const counts = {
      movies: {},
      series: {},
    };
    collection.movies.forEach(movie => {
      const status = movie.statuses.at(-1)?.name;
      if (status) {
        counts.movies[status] = (counts.movies[status] || 0) + 1;
      }
    });

    collection.series.forEach(serie => {
      const status = serie.statuses.at(-1)?.name;
      if (status) {
        counts.series[status] = (counts.series[status] || 0) + 1;
      }
    });

    return { collection, counts };
  });

export { getCollection };
