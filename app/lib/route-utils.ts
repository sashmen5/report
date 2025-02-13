import { redirect } from '@tanstack/react-router';
import { createMiddleware, createServerFn } from '@tanstack/start';
import jwt from 'jsonwebtoken';
import { getCookie } from 'vinxi/http';

import { UserDTO } from '../models';

const fetchAuth = createServerFn({ method: 'GET' }).handler(async ({ context }) => {
  const token = getCookie('alex-token');
  const user: UserDTO | undefined = await jwt.decode(token);

  if (!user) {
    throw redirect({ to: '/login' });
  }

  return {
    user,
  };
});

const authMiddleware = createMiddleware().server(async ({ next, data }) => {
  const user = await fetchAuth();
  if (!user.user) {
    throw redirect({ to: '/login' });
  }
  return next({ context: user });
});

export { fetchAuth, authMiddleware };
