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

const fetchSearch = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { query: string }) => {
    return {
      query: data.query,
    };
  })
  .handler(async ({ data, context }) => {
    const searchResult = await tmdbService.search(data.query);
    const collection = (await collectionService.getByUserId(context.user.id)) as Collection;

    return {
      search: searchResult,
      collection,
    };
  });

export const Route = createFileRoute('/_authed/search')({
  loaderDeps: ({ search }) => ({ query: search.query }),
  loader: async ctx => {
    return fetchSearch({ data: { query: ctx.deps.query ?? '' } });
  },
  gcTime: 0,
  staleTime: 0,
  component: SearchPage,
  validateSearch: (params: Record<string, unknown>): SearchParams => {
    return {
      query: searchParamsValidate.string(params.query),
    };
  },
});
