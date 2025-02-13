import { ComponentProps, FC } from 'react';

import { cn } from '@sashmen5/components';

const MediaCard: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return <div {...props} className={cn('flex flex-col', className)} />;
};

const MediaImg: FC<ComponentProps<'img'>> = ({ className, alt, ...props }) => {
  return <img {...props} alt={alt} className={cn('border-none object-cover', className)} />;
};

const MediaTitle: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return <div {...props} className={cn('text-sm font-bold', className)} />;
};

const MediaDescription: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return <p {...props} className={cn('text-sm text-muted-foreground', className)} />;
};

export { MediaCard, MediaImg, MediaTitle, MediaDescription };
