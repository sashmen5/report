import { type CollectionService, collectionService } from '../collection';
import { type MovieService, movieService } from '../movie';
import { type TMDBService, tmdbService } from '../tmdb';

class MediaManagerService {
  constructor(
    private tmdbService: TMDBService,
    private collectionService: CollectionService,
    private movieService: MovieService,
  ) {}

  async addMovie({ userId, movieId }: { userId: string; movieId: number }) {
    let movie = await this.movieService.getMovie(movieId);

    if (!movie) {
      movie = await this.tmdbService.searchMovieById(movieId);
      movie.creationDate = Date.now();
      await this.movieService.addMovie(movie);
    }

    await this.collectionService.addMovie(userId, movieId, 'added');
  }

  async updateMovieStatus({ userId, movieId, status }: { userId: string; movieId: number; status: string }) {
    const movie = await this.movieService.getMovie(movieId);
    if (!movie) {
      return {
        error: 'Not movie in DB',
      };
    }

    const itemFromUserCollection = await this.collectionService.getByUserId(userId);
    if (!itemFromUserCollection) {
      await this.collectionService.addMovie(userId, movieId, status);
    } else {
      await this.collectionService.updateMovieStatus(userId, movieId, status);
    }

    return {
      success: true,
    };
  }
}

const mediaManagerService = new MediaManagerService(tmdbService, collectionService, movieService);
export { mediaManagerService, MediaManagerService };
