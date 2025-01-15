import { ComponentProps, FC } from 'react';

import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from './cn';

const Drawer: FC<ComponentProps<typeof DrawerPrimitive.Root>> = ({
  shouldScaleBackground = true,
  ...props
}) => <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />;

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay: FC<ComponentProps<typeof DrawerPrimitive.Overlay>> = ({ className, ...props }) => (
  <DrawerPrimitive.Overlay className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} />
);

const DrawerContent: FC<ComponentProps<typeof DrawerPrimitive.Content>> = ({
  className,
  children,
  ...props
}) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
);

const DrawerHeader: FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
);

const DrawerFooter: FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
);

const DrawerTitle: FC<ComponentProps<typeof DrawerPrimitive.Title>> = ({ className, ...props }) => (
  <DrawerPrimitive.Title
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
);

const DrawerDescription: FC<ComponentProps<typeof DrawerPrimitive.Description>> = ({
  className,
  ...props
}) => <DrawerPrimitive.Description className={cn('text-sm text-muted-foreground', className)} {...props} />;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
