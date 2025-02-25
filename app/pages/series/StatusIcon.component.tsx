import React, { ReactNode } from 'react';

import { IconBookmark, IconCancel, IconFreezeRow, IconHourglassEmpty } from '@tabler/icons-react';

export enum Status {
  Finished = 'Ended',
  InProgress = 'Returning Series',
  Planning = 'Planning',
  InProduction = 'In Production',
  Canceled = 'Canceled',
}

const icons: Record<Status, ReactNode> = {
  [Status.Finished]: <IconFreezeRow />,
  [Status.InProgress]: <IconHourglassEmpty />,
  [Status.Planning]: <IconBookmark />,
  [Status.InProduction]: <IconBookmark />,
  [Status.Canceled]: <IconCancel />,
};

interface Props {
  status: string;
}

export const StatusIcon = ({ status }: Props) => {
  const icon = icons[status];
  return icon;
};
