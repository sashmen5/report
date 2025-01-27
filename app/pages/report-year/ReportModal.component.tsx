import React, { FC, PropsWithChildren, useRef } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@sashmen5/components';
import { useMediaQuery } from '@sashmen5/hooks';

interface Props extends PropsWithChildren {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title?: string;
}

const ReportModal: FC<Props> = ({ open, title, onOpenChange, children }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const drawerRef = useRef<HTMLDivElement>(null);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <DrawerContent ref={drawerRef}>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div className={'overflow-y-auto px-4 pb-4'}>{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export { ReportModal };
