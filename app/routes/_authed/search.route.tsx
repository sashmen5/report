import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { collectionService } from '../../entities/collection';
import { tmdbService } from '../../entities/tmdb';
import { authMiddleware } from '../../lib/route-utils';
import { searchParamsValidate } from '../../lib/search-param-validators';
import { Collection } from '../../models/collecton.schema';
import { SearchPage } from '../../pages';

interface SearchParams {
  query?: string;
}

export const Route = createFileRoute('/_authed/search')({
  component: SearchPage,
  validateSearch: (params: Record<string, unknown>): SearchParams => {
    return {
      query: searchParamsValidate.string(params.query),
    };
  },
});
