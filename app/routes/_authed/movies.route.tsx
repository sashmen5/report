import { createFileRoute } from '@tanstack/react-router';

import { getCollection } from '../../entities/collection';
import { getMovies } from '../../entities/movie';
import { MoviesPage } from '../../pages/movies';

export const Route = createFileRoute('/_authed/movies')({
  ssr: false,
  loader: async () => {
    //rewrite with promise.all
    const [movies, collection] = await Promise.all([getMovies(), getCollection()]);

    return { movies, collection };
  },
  component: MoviesPage,
});
