import React, { ReactNode } from 'react';

import { IconBookmark, IconFreezeRow, IconHourglassEmpty } from '@tabler/icons-react';

export enum Status {
  Finished = 'Ended',
  InProgress = 'Returning Series',
  Planning = 'Planning',
}

const icons: Record<Status, ReactNode> = {
  [Status.Finished]: <IconFreezeRow />,
  [Status.InProgress]: <IconHourglassEmpty />,
  [Status.Planning]: <IconBookmark />,
};

interface Props {
  status: string;
}

export const StatusIcon = ({ status }: Props) => {
  const icon = icons[status];
  return icon;
};
