import { FC, useState } from 'react';

import { Button, Input, Label } from '@sashmen5/components';
import { notFound, useNavigate } from '@tanstack/react-router';
import { createServerFn, json } from '@tanstack/start';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GalleryVerticalEnd } from 'lucide-react';
import { createError, sendError, setCookie } from 'vinxi/http';

import { dbConnectMiddleware } from '../../lib/db';
import { User } from '../../models';

interface SignupFormData {
  email: string;
  password: string;
}

interface Props {
  onSubmit: (v: SignupFormData) => void;
}

const loginServerFn = createServerFn({ method: 'POST' })
  .validator((d: SignupFormData) => d)
  .middleware([dbConnectMiddleware])
  .handler(async ({ data }) => {
    const { email, password } = data;

    const user = await User.findOne({ email });
    console.log(user);

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

const LoginPage: FC<Props> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={'flex flex-col gap-6'}>
          <div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Acme Inc.</span>
                <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="passowrd"
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onMouseDown={async () => {
                    await loginServerFn({ data: { email: username, password: password } });
                    await navigate({ to: '/' });
                  }}
                >
                  Login
                </Button>

                {/*<Button*/}
                {/*  variant={'outline'}*/}
                {/*  className="w-full"*/}
                {/*  onMouseDown={() => {*/}
                {/*    console.log('Sign up');*/}
                {/*    onSubmit({ email: username, password: password });*/}
                {/*  }}*/}
                {/*>*/}
                {/*  Sign up*/}
                {/*</Button>*/}
              </div>
            </div>
          </div>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export { LoginPage };
