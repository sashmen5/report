import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { movieService } from './service';

const getMovies = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const movies = await movieService.getMovies();
    return {
      movies: movies,
    };
  });

export { getMovies };
