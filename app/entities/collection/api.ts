import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { collectionService } from './service';

const getCollection = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { id } = context.user;
    const collection = await collectionService.getByUserId(id);
    if (!collection) {
      return { error: 'Collection not found' };
    }
    return { collection };
  });

export { getCollection };
