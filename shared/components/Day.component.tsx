import { ComponentProps, FC } from 'react';

import { buttonVariants } from './Button.component';
import { cn } from './cn';

interface Props extends ComponentProps<'button'> {
  toDay?: boolean;
}

const Day: FC<Props> = ({ className, toDay, ...rest }) => {
  return (
    <button
      onMouseDown={console.log}
      onClick={console.log}
      {...rest}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'flex aspect-square w-10 items-center justify-center rounded-md border border-gray-300/50 text-gray-400',
        {
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground':
            toDay,
        },
        className,
      )}
    />
  );
};

export { Day };
