import { getRouterManifest } from '@tanstack/start/router-manifest';
import { createStartHandler, defaultStreamHandler } from '@tanstack/start/server';

import { dbConnect, dbConnectMiddleware } from './lib/db';
import { createRouter } from './router';

(async function () {
  await dbConnect();
})();

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
