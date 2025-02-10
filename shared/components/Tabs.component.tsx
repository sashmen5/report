import { ComponentProps, FC } from 'react';

import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from './cn';

const Tabs = TabsPrimitive.Root;

const TabsList: FC<ComponentProps<typeof TabsPrimitive.List>> = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={cn(
      'inline-flex h-full items-center justify-center overflow-hidden text-muted-foreground',
      className,
    )}
    {...props}
  />
);

const TabsTrigger: FC<ComponentProps<typeof TabsPrimitive.Trigger>> = ({ className, ...props }) => {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'relative p-1',
        'inline-flex h-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50',
        'w-[110px] min-w-12 max-w-[110px]',
        'data-[state=active]:text-primary',

        'before:bg-primary',
        'before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-[2px]',
        'before:translate-y-full before:transition-transform before:data-[state=active]:translate-y-0',
        'before:duration-200 before:ease-in',

        'after:z-[-1] after:hover:bg-muted',
        'after:data-[state=active]:hidden',
        'after:absolute after:inset-1 after:rounded',
        className,
      )}
      {...props}
    />
  );
};

const TabsContent: FC<ComponentProps<typeof TabsPrimitive.Content>> = ({ className, ...props }) => (
  <TabsPrimitive.Content
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
