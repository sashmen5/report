import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';
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

export { fetchAuth };
