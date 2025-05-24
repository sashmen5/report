import { FC } from 'react';

import { cn } from '@sashmen5/components';
import { IconStarFilled } from '@tabler/icons-react';

import { keyBy } from '../../../shared/utils';
import { MovieSchema } from '../../models';
import { PopcornIcon } from './PopcornIcon.component';
import { TomatoIcon } from './TomatoIcon.component';

interface Props {
  ratings?: MovieSchema['ratings'];
  className?: string;
}

const RatingComponent: FC<Props> = ({ ratings, className }) => {
  const byRatings = keyBy(ratings ?? [], 'source');

  return (
    <div className={cn('grid grid-cols-3 grid-rows-[20px] text-xs font-bold [&_svg]:size-3.5', className)}>
      {byRatings['imdb'] && (
        <div className={'inline-flex items-center gap-1'}>
          <IconStarFilled className={'fill-[#f5c518]'} />
          <div>{byRatings['imdb']?.value.split('/').at(0)}</div>
        </div>
      )}
      {byRatings['popcornmeter'] && (
        <div className={'inline-flex items-center gap-1'}>
          <PopcornIcon />
          <div>{byRatings['popcornmeter']?.value}</div>
        </div>
      )}
      {byRatings['rotten_tomatoes'] && (
        <div className={'inline-flex items-center gap-1'}>
          <TomatoIcon />
          <div>{byRatings['rotten_tomatoes']?.value.split('%').at(0)}</div>
        </div>
      )}
    </div>
  );
};

export { RatingComponent };
