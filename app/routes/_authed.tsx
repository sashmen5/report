import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { fetchAuth } from '../lib/route-utils';
import { User, UserDTO } from '../models';

const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const { user } = await fetchAuth();
  if (!user) {
    throw notFound();
  }

  const fullUser = await User.findOne<UserDTO>({ id: user.id }).exec();
  if (!fullUser) {
    throw notFound();
  }

  return { user: fullUser };
});

export const Route = createFileRoute('/_authed')({
  loader: async () => await getUser(),
  beforeLoad: async () => await fetchAuth(),
});
