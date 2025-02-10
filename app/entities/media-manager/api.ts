import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { mediaManagerService } from './media-manager-service';

const addMovie = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: { id: number }) => d as { id: number })
  .handler(async ({ context, data }) => {
    console.log('data', data);
    const movie = await mediaManagerService.addMovie({ userId: context.user.id, movieId: data.id });
    return {
      movie: movie,
    };
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

export { addMovie, updateMovieStatus };
