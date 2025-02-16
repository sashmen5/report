import { type CollectionService, collectionService } from '../collection';
import { type MovieService, movieService } from '../movie';
import { type SerieService, serieService } from '../serie';
import { type TMDBService, tmdbService } from '../tmdb';

class MediaManagerService {
  constructor(
    private tmdbService: TMDBService,
    private collectionService: CollectionService,
    private movieService: MovieService,
    private serieService: SerieService,
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

  async refreshMovie(id: number) {
    const movie = await this.tmdbService.searchMovieById(id);
    movie.creationDate = Date.now();
    await this.movieService.deleteMovie(id);
    await this.movieService.addMovie(movie);
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

  async addSerie({ userId, id }: { userId: string; id: number }) {
    let serie = await this.serieService.getById(id);

    if (!serie) {
      const tmdbSerie = await this.tmdbService.searchSerieById(id);
      const serie = this.serieService.convertToSerie(tmdbSerie);
      serie.creationDate = Date.now();
      await this.serieService.add(serie);
    }

    await this.collectionService.addSerie(userId, id, 'added');
  }

  async updateSerieStatus({ userId, id, status }: { userId: string; id: number; status: string }) {
    const serie = await this.serieService.getById(id);
    if (!serie) {
      return { error: 'Not serie in DB' };
    }

    const itemFromUserCollection = await this.collectionService.getByUserId(userId);
    if (!itemFromUserCollection) {
      await this.collectionService.addSerie(userId, id, status);
    } else {
      await this.collectionService.updateSerieStatus(userId, id, status);
    }

    return {
      success: true,
    };
  }

  async refreshSerie(id: number) {
    const tmdbSerie = await this.tmdbService.searchSerieById(id);
    tmdbSerie.creationDate = Date.now();
    await this.serieService.delete(id);
    const serie = this.serieService.convertToSerie(tmdbSerie);
    await this.serieService.add(serie);
  }

  async getSeasonsFromApi(serieId: number | string): Promise<TMDB.Season[]> {
    const serie = await this.serieService.getById(serieId);
    if (!serie) {
      return [];
    }

    const seasonNumbers = serie.seasons.map(season => season.seasonNumber);
    const res: TMDB.Season[] = [];
    for (const seasonNumber of seasonNumbers) {
      const season = await this.tmdbService.searchSeasonByNumber(serieId, seasonNumber);
      res.push(season);
    }

    return res;
  }
}

const mediaManagerService = new MediaManagerService(
  tmdbService,
  collectionService,
  movieService,
  serieService,
);
export { mediaManagerService, MediaManagerService };
