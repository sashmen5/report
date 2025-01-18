import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';
// import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';
import { uid } from 'uid';
import { getCookie } from 'vinxi/http';

import { dbConnectMiddleware } from '../../lib/db';
import { User } from '../../models';
import { LoginPage } from '../../pages';

interface SignupFormData {
  email: string;
  password: string;
}

export async function signup(state: SignupFormData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { email, password } = state;
  // e.g. Hash the user's password before storing it
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    email,
    password: hashedPassword,
    id: uid(21),
  });

  const savedUser = await newUser.save();

  return {
    message: 'User created successfully',
    success: true,
    user: {
      email,
      ...savedUser,
    },
  };

  // 3. Insert the user into the database or call an Auth Library's API
  // const data = await db
  //   .insert(users)
  //   .values({
  //     name,
  //     email,
  //     password: hashedPassword,
  //   })
  //   .returning({ id: users.id });

  // const user = data[0];

  // if (!user) {
  //   return {
  //     message: 'An error occurred while creating your account.',
  //   };
  // }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}

const signupServerFn = createServerFn({ method: 'POST' })
  .validator((d: SignupFormData) => d)
  .middleware([dbConnectMiddleware])
  .handler(async ({ data }) => {
    return await signup(data);
  });

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const cookie = getCookie('alex-token');

  if (cookie) {
    // This will error because you're redirecting to a path that doesn't exist yet
    // You can create a sign-in route to handle this
    throw redirect({
      to: '/',
    });
  }

  return {};
});

export const Route = createFileRoute('/login/')({
  beforeLoad: async () => await authStateFn(),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <LoginPage
      onSubmit={v =>
        signupServerFn({
          data: v,
        })
      }
    />
  );
}
