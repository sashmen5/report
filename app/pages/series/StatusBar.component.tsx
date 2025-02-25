import { FC, ReactNode } from 'react';
import * as React from 'react';

import {
  IconSquareRoundedNumber1 as IconHexagonNumber1,
  IconSquareRoundedNumber2 as IconHexagonNumber2,
  IconSquareRoundedNumber3 as IconHexagonNumber3,
  IconSquareRoundedNumber4 as IconHexagonNumber4,
  IconSquareRoundedNumber5 as IconHexagonNumber5,
  IconSquareRoundedNumber6 as IconHexagonNumber6,
  IconSquareRoundedNumber7 as IconHexagonNumber7,
  IconSquareRoundedNumber8 as IconHexagonNumber8,
  IconSquareRoundedNumber9 as IconHexagonNumber9,
  IconNumber10Small,
  IconNumber11Small,
  IconNumber12Small,
  IconNumber13Small,
  IconNumber14Small,
  IconNumber15Small,
  IconNumber16Small,
  IconNumber17Small,
  IconNumber18Small,
  IconNumber19Small,
  IconNumber20Small,
  IconNumber21Small,
  IconNumber22Small,
  IconNumber23Small,
} from '@tabler/icons-react';

import { Serie } from '../../models/serie.schema';
import { StatusIcon } from './StatusIcon.component';

const numberToIcon: Record<number, ReactNode> = {
  1: <IconHexagonNumber1 />,
  2: <IconHexagonNumber2 />,
  3: <IconHexagonNumber3 />,
  4: <IconHexagonNumber4 />,
  5: <IconHexagonNumber5 />,
  6: <IconHexagonNumber6 />,
  7: <IconHexagonNumber7 />,
  8: <IconHexagonNumber8 />,
  9: <IconHexagonNumber9 />,
  10: <IconNumber10Small />,
  11: <IconNumber11Small />,
  12: <IconNumber12Small />,
  13: <IconNumber13Small />,
  14: <IconNumber14Small />,
  15: <IconNumber15Small />,
  16: <IconNumber16Small />,
  17: <IconNumber17Small />,
  18: <IconNumber18Small />,
  19: <IconNumber19Small />,
  20: <IconNumber20Small />,
  21: <IconNumber21Small />,
  22: <IconNumber22Small />,
  23: <IconNumber23Small />,
};

interface Props {
  serie: Serie;
}

const StatusBar: FC<Props> = ({ serie }) => {
  const average = serie.episodeRunTime.reduce((a, b) => a + b, 0) / serie.episodeRunTime.length;
  const seasons = serie.seasons.filter(d => d.seasonNumber !== 0);
  return (
    <div className={'flex px-1 text-muted-foreground [&_svg]:stroke-[1.5]'}>
      <StatusIcon status={serie.status} />
      {numberToIcon[seasons.length] ?? seasons.length}
      {!isNaN(average) && (
        <div className={'flex h-6 items-center justify-center px-0.5 text-sm font-normal'}>{average}min</div>
      )}
    </div>
  );
};

export { StatusBar };
