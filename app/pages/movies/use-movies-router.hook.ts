import { useCallback } from 'react';

import { getRouteApi } from '@tanstack/react-router';
import { cleanEmptyParams } from 'shared/utils';

const Route = getRouteApi('/_authed/movies');
function useMoviesRouter() {
  const queryParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const setQueryParams = useCallback(
    (partialFilters: Partial<typeof queryParams>, options?: { replace?: boolean }) =>
      navigate({
        replace: options?.replace,
        search: prev => cleanEmptyParams({ ...prev, ...partialFilters }),
      }),
    [navigate],
  );

  return {
    queryParams,
    setQueryParams,
  };
}

export { useMoviesRouter };
