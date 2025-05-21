import { createServerFn } from '@tanstack/react-start';

import { authMiddleware } from '../../lib/route-utils';
import { mediaManagerService } from './media-manager-service';

const addMovie = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: { id: number }) => d as { id: number })
  .handler(async ({ context, data }) => {
    const movie = await mediaManagerService.addMovie({ userId: context.user.id, movieId: data.id });
    return { movie: movie };
  });

const refreshMovie = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: { id: number }) => d as { id: number })
  .handler(async ({ data }) => {
    await mediaManagerService.refreshMovie(data.id);
    return { message: 'Movie refreshed' };
  });

const refreshAllMovies = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async () => {
    await mediaManagerService.refreshAllMovies();
    return { message: 'Movies started to refreshe' };
  });

const updateMovieStatus = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(({ status, movieId }: { status: string; movieId: number }) => {
    return { status, movieId };
  })
  .handler(async ({ context, data }) => {
    const { id } = context.user;
    return await mediaManagerService.updateMovieStatus({
      userId: id,
      status: data.status,
      movieId: data.movieId,
    });
  });

const addSerie = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: { id: number }) => d as { id: number })
  .handler(async ({ context, data }) => {
    const serie = await mediaManagerService.addSerie({ userId: context.user.id, id: data.id });
    return { serie };
  });

const updateSerieStatus = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(({ status, id }: { status: string; id: number }) => {
    return { status, id: id };
  })
  .handler(async ({ context, data }) => {
    const { id } = context.user;
    return await mediaManagerService.updateSerieStatus({
      userId: id,
      status: data.status,
      id: data.id,
    });
  });

const refreshSerie = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: { id: number }) => d as { id: number })
  .handler(async ({ data }) => {
    await mediaManagerService.refreshSerie(data.id);
    return { message: 'Serie refreshed' };
  });

export {
  addMovie,
  updateMovieStatus,
  addSerie,
  updateSerieStatus,
  refreshMovie,
  refreshSerie,
  refreshAllMovies,
};
