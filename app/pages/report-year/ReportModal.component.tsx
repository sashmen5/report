import React, { FC, PropsWithChildren, ReactNode, useRef } from 'react';

import {
  Button,
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
  title?: ReactNode;
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
        </DrawerHeader>
        <div className={'overflow-y-auto px-4 pb-4'}>{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export { ReportModal };
