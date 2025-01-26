import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sashmen5/components';
import { useNavigate } from '@tanstack/react-router';
import { createServerFn, json } from '@tanstack/start';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { deleteCookie } from 'vinxi/http';

const logout = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  deleteCookie('alex-token');
  return {
    message: 'Logout successful',
    success: true,
  };
});

interface Props {
  header?: ReactNode;
  initial?: string;
}

export function ModeToggle({ header, initial }: Props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          tabIndex={0}
          className={
            'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          }
        >
          <AvatarFallback>{initial}</AvatarFallback>
          <span className="sr-only">Toggle theme</span>
        </Avatar>

        {/*<Button variant="outline" size="icon">*/}
        {/*  <Menu className="h-[1.2rem] w-[1.2rem]" />*/}
        {/*  */}
        {/*</Button>*/}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {header}
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await logout();
            await navigate({ to: '/login' });
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
