// app/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

export function createRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPendingMinMs: 0,
    defaultPendingMs: 0,
    defaultPendingComponent: () => <div>{'Loading'}</div>,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
