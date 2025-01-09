// app/routes/__root.tsx
import { ReactNode } from 'react';

import { Outlet, ScrollRestoration, createRootRoute } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';

import appCss from '../styles/app.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Report sashmen5!',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss, suppressHydrationWarning: false }],
    scripts: [{ src: '/scripts/entry.js', suppressHydrationWarning: true }],
  }),
  component: RootComponent,
  notFoundComponent: () => <div>NotFound</div>,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
