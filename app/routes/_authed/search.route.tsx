import { createFileRoute } from '@tanstack/react-router';

import { searchParamsValidate } from '../../lib/search-param-validators';
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
