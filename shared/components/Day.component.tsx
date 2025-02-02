import { ComponentProps, FC } from 'react';

import { buttonVariants } from './Button.component';
import { cn } from './cn';

interface Props extends ComponentProps<'button'> {
  toDay?: boolean;
  includesHabits?: boolean;
}

const Day: FC<Props> = ({ children, className, includesHabits, toDay, ...rest }) => {
  return (
    <button
      {...rest}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'flex h-10 w-10 flex-col items-center justify-start rounded-md border border-gray-300/50 p-0 text-gray-400',
        className,
      )}
    >
      {children}
    </button>
  );
};

export { Day };
