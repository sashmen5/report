import { createFileRoute } from '@tanstack/react-router';

import { fetchAuth } from '../lib/route-utils';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => await fetchAuth(),
});
