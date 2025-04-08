import { createFileRoute } from '@tanstack/react-router';

import { getMovies } from '../../entities/media-manager';
import { MovieStatus, movieEntity } from '../../entities/movie';
import { MoviesPage } from '../../pages/movies';

interface SearchParams {
  status: MovieStatus;
}

function validateStatus(status?: unknown) {
  if (!status) {
    return movieEntity.status.added;
  }

  return movieEntity.isStatus(status) ? status : movieEntity.status.added;
}

export const Route = createFileRoute('/_authed/movies')({
  pendingComponent: () => <div className={'text-lg font-bold'}>Loading...</div>,
  loaderDeps: ({ search: { status } }) => ({ status }),
  loader: async ({ deps: { status } }) => {
    return await getMovies({ data: { filter: { status: status } } });
  },
  validateSearch: ({ status }: Record<string, unknown>): SearchParams => {
    return {
      status: validateStatus(status),
    };
  },
  component: MoviesPage,
});
