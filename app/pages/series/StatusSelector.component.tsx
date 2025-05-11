import React, { ComponentProps, FC } from 'react';

import { Button, cn } from '@sashmen5/components';
import { getRouteApi } from '@tanstack/react-router';

import { SerieAtom } from '../../entities/serie';
import { useSeriesRouter } from './use-series-router.hook';

const Route = getRouteApi('/_authed/series');

const StatusSelector: FC<ComponentProps<'div'>> = ({ ...rest }) => {
  const { collection } = Route.useLoaderData();
  const {
    queryParams: { status: selectedStatus },
    setQueryParams,
  } = useSeriesRouter();
  return (
    <div {...rest}>
      {SerieAtom.statusOrder.map(status => (
        <Button
          size={'sm'}
          key={status}
          variant={selectedStatus === status ? 'default' : 'secondary'}
          onClick={() => setQueryParams({ status })}
          className={'h-auto px-2 py-1'}
        >
          {SerieAtom.getLabel(status)}
          <span
            className={cn({
              'text-muted-foreground': selectedStatus !== status,
            })}
          >
            {collection.counts?.series[status]}
          </span>
        </Button>
      ))}
    </div>
  );
};

export { StatusSelector };
