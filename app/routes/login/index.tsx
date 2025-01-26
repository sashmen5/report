import { createFileRoute } from '@tanstack/react-router';

import { authStateFn, signupServerFn } from '../../lib/auth';
import { LoginPage } from '../../pages';

export const Route = createFileRoute('/login/')({
  beforeLoad: async () => await authStateFn(),
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginPage onSubmit={v => signupServerFn({ data: v })} />;
}
