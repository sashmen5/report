// app/ssr.tsx
/// <reference types="vinxi/types/server" />
import { getRouterManifest } from '@tanstack/start/router-manifest';
import { createStartHandler, defaultStreamHandler } from '@tanstack/start/server';

import { dbConnect, dbConnectMiddleware } from './lib/db';
// import { registerGlobalMiddleware } from '@tanstack/start'

import { createRouter } from './router';

// dbConnect()

// registerGlobalMiddleware({
//     middleware: [dbConnectMiddleware],
// })

(async function () {
  await dbConnect();
})();

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
