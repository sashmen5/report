import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { authMiddleware, fetchAuth } from '../lib/route-utils';
import { User, UserDTO } from '../models';

const getUser = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const fullUser = await User.findOne<UserDTO>({ id: context.user.id }).exec();
    if (!fullUser) {
      throw notFound();
    }

    return { user: fullUser };
  });

export const Route = createFileRoute('/_authed')({
  loader: async () => await getUser(),
});
