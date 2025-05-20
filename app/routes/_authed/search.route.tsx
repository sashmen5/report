import { createFileRoute } from '@tanstack/react-router';

import { searchParamsValidate } from '../../lib/search-param-validators';
import { SearchPage } from '../../pages';

export const Route = createFileRoute('/_authed/search')({
  component: SearchPage,
  validateSearch: (params: Record<string, unknown>) => {
    return {
      search: searchParamsValidate.string(params.search),
    };
  },
});
