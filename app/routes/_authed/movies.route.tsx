import { createFileRoute } from '@tanstack/react-router';
import { isString } from 'shared/utils';

import { getCollection } from '../../entities/collection';
import { MovieAtom, MovieStatus, getMovies } from '../../entities/movie';
import { MoviesPage } from '../../pages/movies';

interface SearchParams {
  status?: MovieStatus;
  search?: string;
}

export const Route = createFileRoute('/_authed/movies')({
  loader: async () => {
    //rewrite with promise.all
    const [movies, collection] = await Promise.all([getMovies(), getCollection()]);

    return { movies, collection };
  },
  validateSearch: ({ status, search }): SearchParams => {
    return {
      status: MovieAtom.isStatus(status) ? status : MovieAtom.DefaultStatus,
      search: isString(search) ? search : undefined,
    };
  },
  component: MoviesPage,
});
