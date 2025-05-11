import React, { ComponentProps, FC } from 'react';

import { Button, cn } from '@sashmen5/components';
import { getRouteApi } from '@tanstack/react-router';

import { MovieAtom } from '../../entities/movie';
import { useMoviesRouter } from './use-movies-router.hook';

const Route = getRouteApi('/_authed/movies');

const StatusSelector: FC<ComponentProps<'div'>> = ({ ...rest }) => {
  const { collection } = Route.useLoaderData();
  const {
    queryParams: { status: selectedStatus },
    setQueryParams,
  } = useMoviesRouter();
  return (
    <div {...rest}>
      {MovieAtom.statusOrder.map(status => (
        <Button
          size={'sm'}
          key={status}
          variant={selectedStatus === status ? 'default' : 'secondary'}
          onClick={() => setQueryParams({ status })}
          className={'h-auto px-2 py-1'}
        >
          {MovieAtom.getLabel(status)}
          <span
            className={cn({
              'text-muted-foreground': selectedStatus !== status,
            })}
          >
            {collection.counts?.movies[status]}
          </span>
        </Button>
      ))}
    </div>
  );
};

export { StatusSelector };
