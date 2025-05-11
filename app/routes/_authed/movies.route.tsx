import { createFileRoute } from '@tanstack/react-router';

import { getCollection } from '../../entities/collection';
import { MovieAtom, MovieStatus, getMovies } from '../../entities/movie';
import { MoviesPage } from '../../pages/movies';

export const Route = createFileRoute('/_authed/movies')({
  loader: async () => {
    //rewrite with promise.all
    const [movies, collection] = await Promise.all([getMovies(), getCollection()]);

    return { movies, collection };
  },
  validateSearch: ({ status }) => {
    return {
      status: MovieAtom.isStatus(status) ? status : MovieAtom.DefaultStatus,
    };
  },
  component: MoviesPage,
});
