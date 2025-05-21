import { ComponentProps, FC } from 'react';

import { Portal } from '@radix-ui/react-portal';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

import { cn } from './cn';

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster: FC<ComponentProps<typeof Sonner>> = ({ ...props }) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      duration={1_000}
      position={'bottom-center'}
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={{
        '--width': '80px',
      }}
      toastOptions={{
        classNames: {
          toast: cn(
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            'group-[.toaster]:py-1 group-[.toaster]:px-2  flex items-center justify-center',
            'group-[.toaster]:w-[80px]',
          ),
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          icon: 'text-success',
        },
      }}
      {...props}
    />
  );
};

const PortalToaster = () => {
  return (
    <Portal
      onClick={e => {
        console.log('bro');
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div
        onClick={e => {
          console.log('click');
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Toaster />
      </div>
    </Portal>
  );
};

export { Toaster, PortalToaster };
