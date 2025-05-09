import { getRouterManifest } from '@tanstack/react-start/router-manifest';
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';

import { dbConnect } from './lib/db';
import { createRouter } from './router';

(async function () {
  await dbConnect();
})();

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
