import { memo, useEffect, useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@sashmen5/components';
import { Link, Outlet, createFileRoute, useRouterState } from '@tanstack/react-router';
import { Clapperboard, Flag, Search, TvMinimalPlay } from 'lucide-react';

import { MovieAtom } from '../entities/movie';
import { getUser } from '../entities/user';

export const Route = createFileRoute('/_authed')({
  loader: async () => await getUser(),
  component: AuthedComponent,
});

function AuthedComponent() {
  const state = useRouterState();

  return (
    <div style={{ '--header-height': '56px' }}>
      <div className={'shadow-b fixed left-0 right-0 top-0 z-10 h-[--header-height] bg-background shadow-md'}>
        <div className={'inline-flex h-full w-full flex-grow justify-center px-10'}>
          <Tabs value={state.location.pathname} className={'w-full'}>
            <TabsList className={'w-full'}>
              <TabsTrigger asChild value="/year">
                <Link to={'/year'} preload={'render'}>
                  <Flag strokeWidth={2} className={'group-data-[state="active"]:fill-current'} />
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="/movies" preload={'render'}>
                <Link to={'/movies'}>
                  <Clapperboard className={'group-data-[state="active"]:last:*:fill-current'} />
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="/series">
                <Link to={'/series'}>
                  <TvMinimalPlay className={'group-data-[state="active"]:fill-current'} />
                </Link>
              </TabsTrigger>
              <TabsTrigger asChild value="/search">
                <Link to={'/search'}>
                  <Search className={'group-data-[state="active"]:fill-current'} />
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className={'mx-auto max-w-3xl px-2 pt-[--header-height]'}>
        <Outlet />
      </div>
    </div>
  );
}
