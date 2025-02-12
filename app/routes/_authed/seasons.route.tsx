import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/seasons')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
