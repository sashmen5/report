import { createFileRoute } from '@tanstack/react-router';

import { getUser } from '../entities/user';

export const Route = createFileRoute('/_authed')({
  loader: async () => await getUser(),
});
