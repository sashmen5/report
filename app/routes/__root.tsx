// app/routes/__root.tsx
import { ReactNode } from 'react';

import { Outlet, ScrollRestoration, createRootRoute } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import { ThemeProvider } from 'next-themes';

import appCss from '../styles/app.css?url';

export const Route = createRootRoute({
  ssr: false,
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
    scripts: (function () {
      if (!import.meta.env.DEV) {
        return [];
      }

      return [
        {
          type: 'module',
          children: `import RefreshRuntime from "/_build/@react-refresh";
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type`,
        },
      ];
    })(),
  }),

  component: RootComponent,
  notFoundComponent: () => <div>[NotFound]</div>,
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
    <html suppressHydrationWarning>
      <head>
        <Meta />
      </head>
      <body>
        <ThemeProvider
          attribute={'class'}
          defaultTheme={'light'}
          storageKey={'theme'}
          disableTransitionOnChange
        >
          {/*<div data-vaul-drawer-wrapper={''} className={'bg-background'}>*/}
          <div className={'bg-background'}>{children}</div>
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
