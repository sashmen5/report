class MovieEntity {
  status: {
    added: 'added';
    watched: 'watched';
    removed: 'removed';
    favorite: 'favorite';
  };

  constructor() {
    this.status = {
      added: 'added',
      watched: 'watched',
      removed: 'removed',
      favorite: 'favorite',
    };
  }

  isStatus(status: unknown): status is keyof MovieEntity['status'] {
    return Object.values(this.status).includes(status as keyof MovieEntity['status']);
  }
}

type MovieStatus = keyof MovieEntity['status'];

const movieEntity = new MovieEntity();

console.log('[[movieEntity', movieEntity);

export { movieEntity };
export type { MovieStatus };
