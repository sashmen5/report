import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { CACHE } from '../../lib/api';
import { authMiddleware } from '../../lib/route-utils';
import { User, UserDTO } from '../../models';

const getUser = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    let user = CACHE.getUser(context.user.id) ?? null;
    if (!user) {
      user = await User.findOne<UserDTO>({ id: context.user.id }).exec();
      user && CACHE.setUser(context.user.id, user);
    }

    if (!user) {
      throw notFound();
    }

    return { user };
  });

export { getUser };
