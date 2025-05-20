import { createFileRoute } from '@tanstack/react-router';

import { searchParamsValidate } from '../../lib/search-param-validators';
import { SearchPage } from '../../pages';

interface SearchParams {
  search?: string;
}

export const Route = createFileRoute('/_authed/search')({
  component: SearchPage,
  validateSearch: (params: Record<string, unknown>): SearchParams => {
    return {
      search: searchParamsValidate.string(params.search),
    };
  },
});
