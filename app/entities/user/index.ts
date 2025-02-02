import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { User, UserDTO } from '../../models';

const getUser = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // let user = CACHE.getUser(context.user.id) ?? null;
    const user = await User.findOne<UserDTO>({ id: context.user.id }).exec();
    // if (!user) {
    //   user && CACHE.setUser(context.user.id, user);
    // }

    if (!user) {
      throw notFound();
    }

    return { user };
  });

export { getUser };
