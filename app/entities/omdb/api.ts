import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { omdbService } from './service';

const fetchRatings = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { ids: string[] }) => ({ ids: data.ids }))
  .handler(async ({ data }) => {
    return {
      ratings: await omdbService.searchByIds(data.ids),
    };
  });

export { fetchRatings };
