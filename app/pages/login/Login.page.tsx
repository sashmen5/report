import { FC, useState } from 'react';

import { Button, Input, Label } from '@sashmen5/components';
import { useNavigate } from '@tanstack/react-router';
import { GalleryVerticalEnd } from 'lucide-react';

import { SignupFormData, loginServerFn } from '../../lib/auth';

interface Props {
  onSubmit: (v: SignupFormData) => void;
}

const LoginPage: FC<Props> = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={'flex flex-col gap-6'}>
          <form
            onSubmit={async e => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;
              await loginServerFn({ data: { email, password } });
              await navigate({ to: '/' });
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Acme Inc.</span>
                <h1 className="text-xl font-bold">Welcome to new report world</h1>
                <div className="text-center text-sm">Hello and welcome to report world!</div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" name="email" required placeholder="m@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="passowrd" type="password" name="password" required />
                </div>
                <Button className="w-full" type={'submit'}>
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
