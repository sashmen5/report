import { redirect } from '@tanstack/react-router';
import { createServerFn, json } from '@tanstack/react-start';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uid } from 'uid';
import { getCookie, setCookie } from 'vinxi/http';

import { User } from '../../models';

const loginServerFn = createServerFn({ method: 'POST' })
  .validator((d: SignupFormData) => d)
  .handler(async ({ data }) => {
    const { email, password } = data;

    const user = await User.findOne({ email });

    if (!user) {
      throw json({ message: 'User not found', success: false, error: 404 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      throw json({ message: 'Invalid credentials', success: false, error: 401 });
    }

    const tokenData = {
      id: user.id,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, process.env.POKEMON, { expiresIn: '7d' });
    const dateIn7Days = new Date();
    dateIn7Days.setDate(dateIn7Days.getDate() + 7);
    setCookie('alex-token', token, { expires: dateIn7Days, httpOnly: true });
    return {
      message: 'Login successful',
      success: true,
    };
  });

interface SignupFormData {
  email: string;
  password: string;
}

async function signup(state: SignupFormData) {
  return;
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { email, password } = state;
  // e.g. Hash the user's password before storing it
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

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
      email: savedUser.email,
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
  .handler(async ({ data }) => {
    return await signup(data);
  });
export { loginServerFn, signup, signupServerFn };
export type { SignupFormData };
export const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const cookie = getCookie('alex-token');

  if (cookie) {
    // This will error because you're redirecting to a path that doesn't exist yet
    // You can create a sign-in route to handle this
    throw redirect({ to: '/' });
  }

  return {};
});
