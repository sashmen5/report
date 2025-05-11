import { isString } from 'shared/utils';

export enum SerieStatus {
  InProcess = 'watching',
  Finished = 'finished',
  ForFuture = 'added',
  WaitingForSeason = 'waiting',
  Removed = 'removed',
  Later = 'later',
}

const statusLabels: Record<SerieStatus, string> = {
  [SerieStatus.InProcess]: 'In process',
  [SerieStatus.Finished]: 'Finished',
  [SerieStatus.ForFuture]: 'For future',
  [SerieStatus.WaitingForSeason]: 'Waiting for season',
  [SerieStatus.Removed]: 'Removed',
  [SerieStatus.Later]: 'Later',
};

const getStatusLabel = (status: SerieStatus) => statusLabels[status];
const statusOrder = [
  SerieStatus.InProcess,
  SerieStatus.ForFuture,
  SerieStatus.WaitingForSeason,
  SerieStatus.Finished,
  SerieStatus.Removed,
  SerieStatus.Later,
];

const SerieAtom = {
  Statuses: SerieStatus,
  DefaultStatus: SerieStatus.InProcess,
  statusOrder,
  getLabel: (d: SerieStatus) => statusLabels[d],
  isStatus: (d: unknown): d is SerieStatus =>
    isString(d) && Object.values(SerieStatus).includes(d as SerieStatus),
};

export { SerieAtom };
