import { createServerFn } from '@tanstack/react-start';

import { authMiddleware } from '../../lib/route-utils';
import { tmdbService } from './service';

const fetchSearch = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { query: string }) => ({ query: data.query }))
  .handler(async ({ data, context }) => {
    return {
      search: await tmdbService.search(data.query),
    };
  });

export { fetchSearch };
