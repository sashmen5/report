import { ComponentProps, FC } from 'react';

import { buttonVariants } from './Button.component';
import { cn } from './cn';

interface Props extends ComponentProps<'button'> {
  toDay?: boolean;
  includesHabits?: boolean;
}

const Day: FC<Props> = ({ className, includesHabits, toDay, ...rest }) => {
  return (
    <button
      {...rest}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'flex aspect-square w-10 items-center justify-center rounded-md border border-gray-300/50 text-gray-400',
        {
          'border-muted-foreground bg-muted-foreground text-primary-foreground': toDay,
          'border-2 border-purple-400': includesHabits,
        },
        className,
      )}
    />
  );
};

export { Day };
