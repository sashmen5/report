import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { MovieSchema } from '../../models';
import { collectionService } from '../collection';
import { MovieStatus, movieService } from '../movie';
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

const refreshSerie = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: { id: number }) => d as { id: number })
  .handler(async ({ data }) => {
    await mediaManagerService.refreshSerie(data.id);
    return { message: 'Serie refreshed' };
  });

interface GetMoviesParams {
  filter?: {
    status?: MovieStatus;
  };
}

const getMoviesAndFilter = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: GetMoviesParams) => ({ filter: d.filter }))
  .handler(async ({ data, context }) => {
    const [movies, collection] = await Promise.all([
      movieService.getMovies(),
      collectionService.getByUserId(context.user.id),
    ]);

    const status = data.filter?.status ?? 'added';
    const movieIds =
      collection?.movies
        .map(d => ({ id: d.id, status: d.statuses[d.statuses.length - 1] }))
        .filter(d => d.status !== undefined)
        .filter(d => d.status.name === status) ?? [];

    const moviesByIds: Record<string, MovieSchema> = {};
    movies.forEach(movie => {
      moviesByIds[movie.id] = movie;
    });

    const moviesFiltered: (MovieSchema & { status: MovieStatus })[] = movieIds.map(id => ({
      ...moviesByIds[id.id],
      status: id.status.name as MovieStatus,
    }));

    console.log('[status]', status);

    return {
      movies: [...moviesFiltered],
      collection,
    };
  });

async function getAndFilterMyMovies({ userId, filter }: { userId: string; filter: { status: MovieStatus } }) {
  const [movies, collection] = await Promise.all([
    movieService.getMovies(),
    collectionService.getByUserId(userId),
  ]);

  const status = filter.status;
  const movieIds =
    collection?.movies
      .map(d => ({ id: d.id, status: d.statuses[d.statuses.length - 1] }))
      .filter(d => d.status !== undefined)
      .filter(d => d.status.name === status) ?? [];

  const moviesByIds: Record<string, MovieSchema> = {};
  movies.forEach(movie => {
    moviesByIds[movie.id] = movie;
  });

  const moviesFiltered: (MovieSchema & { status: MovieStatus })[] = movieIds.map(id => ({
    ...moviesByIds[id.id],
    status: id.status.name as MovieStatus,
  }));

  console.log('[status]', status);

  return {
    movies: [...moviesFiltered],
    collection,
  };
}

const getMovies = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((d: GetMoviesParams) => ({ filter: d.filter }))
  .handler(async ({ data, context }) => {
    // const result = await getAndFilterMyMovies({
    const result = await mediaManagerService.getMovies({
      userId: context.user.id,
      filter: { status: data.filter?.status ?? 'added' },
    });
    const { collection } = result;

    const counts = {
      movies: {},
      series: {},
    };
    collection?.movies.forEach(movie => {
      const status = movie.statuses.at(-1)?.name;
      if (status) {
        counts.movies[status] = (counts.movies[status] || 0) + 1;
      }
    });

    collection?.series.forEach(serie => {
      const status = serie.statuses.at(-1)?.name;
      if (status) {
        counts.series[status] = (counts.series[status] || 0) + 1;
      }
    });

    return {
      movies: result.movies,
      collection: result.collection,
      moviesFiltered: result.moviesFiltered,
      movieIds: result.movieIds,
      counts,
    };
  });

export {
  addMovie,
  updateMovieStatus,
  getMoviesAndFilter,
  addSerie,
  updateSerieStatus,
  refreshMovie,
  refreshSerie,
  getMovies,
};
