import { isString } from 'shared/utils';

export enum MovieStatus {
  ADDED = 'added',
  WATCHED = 'watched',
  REMOVED = 'removed',
  FAVORITE = 'favorite',
}

const movieStatusLabels: Record<MovieStatus, string> = {
  [MovieStatus.ADDED]: 'For future',
  [MovieStatus.WATCHED]: 'Watched',
  [MovieStatus.REMOVED]: 'Removed',
  [MovieStatus.FAVORITE]: 'Favorite',
};

const MovieAtom = {
  Statuses: MovieStatus,
  DefaultStatus: MovieStatus.ADDED,
  statusOrder: [MovieStatus.ADDED, MovieStatus.WATCHED, MovieStatus.REMOVED, MovieStatus.FAVORITE],
  getLabel: (d: MovieStatus) => movieStatusLabels[d],
  isStatus: (d: unknown): d is MovieStatus =>
    isString(d) && Object.values(MovieStatus).includes(d as MovieStatus),
};

export { MovieAtom };
