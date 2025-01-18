import * as React from 'react';
import { useEffect, useState } from 'react';

import {
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

export function ModeToggle() {
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
        <Button variant="outline" size="icon">
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
