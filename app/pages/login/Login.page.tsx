import { FC, useState } from 'react';

import { Button, Input, Label } from '@sashmen5/components';
import { useNavigate } from '@tanstack/react-router';
import { GalleryVerticalEnd } from 'lucide-react';

import { SignupFormData, loginServerFn } from '../../lib/auth';

interface Props {
  onSubmit: (v: SignupFormData) => void;
}

const LoginPage: FC<Props> = () => {
  const [username, setUsername] = useState('sashmen5@gmail.com');
  const [password, setPassword] = useState('04091992');
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={'flex flex-col gap-6'}>
          <form
            onSubmit={async e => {
              e.preventDefault();
              await loginServerFn({ data: { email: username, password: password } });
              await navigate({ to: '/' });
            }}
          >
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
                    required
                    placeholder="m@example.com"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="passowrd"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  type={'submit'}
                  // onMouseDown={async () => {
                  //   await loginServerFn({ data: { email: username, password: password } });
                  //   await navigate({ to: '/' });
                  // }}
                  // onKeyDown={async e => {
                  //   if (e.key === 'Enter' || e.key === ' ') {
                  //     await loginServerFn({ data: { email: username, password: password } });
                  //     await navigate({ to: '/' });
                  //   }
                  // }}
                >
                  Login
                </Button>

                {/*<Button*/}
                {/*  variant={'outline'}*/}
                {/*  className="w-full"*/}
                {/*  type={'button'}*/}
                {/*  onMouseDown={e => {*/}
                {/*    e.preventDefault();*/}
                {/*    console.log('Sign up');*/}
                {/*    signUp({ email: username, password: password });*/}
                {/*  }}*/}
                {/*>*/}
                {/*  Sign up*/}
                {/*</Button>*/}
              </div>
            </div>
          </form>
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
