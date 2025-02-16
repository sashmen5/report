import { createServerFn } from '@tanstack/start';

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

export { addMovie, updateMovieStatus, addSerie, updateSerieStatus, refreshMovie };
