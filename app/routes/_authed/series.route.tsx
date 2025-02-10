import { createFileRoute } from '@tanstack/react-router';

import { getCollection } from '../../entities/collection';
import { getMovies } from '../../entities/movie';
import { SeriesPage } from '../../pages/series';

export const Route = createFileRoute('/_authed/series')({
  loader: async () => {
    //rewrite with promise.all
    const [movies, collection] = await Promise.all([getMovies(), getCollection()]);

    return { movies, collection };
  },
  component: SeriesPage,
});
