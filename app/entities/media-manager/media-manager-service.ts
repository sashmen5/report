import { MovieSchema } from '../../models';
import { type CollectionService, collectionService } from '../collection';
import { type MovieService, MovieStatus, movieService } from '../movie';
import { type OMDBService, omdbService } from '../omdb';
import { type SerieService, serieService } from '../serie';
import { type TMDBService, tmdbService } from '../tmdb';
import { toRating } from './utils';

class MediaManagerService {
  constructor(
    private tmdbService: TMDBService,
    private collectionService: CollectionService,
    private movieService: MovieService,
    private serieService: SerieService,
    private omdbService: OMDBService,
  ) {}

  async completeData(imdbId?: string): Promise<{ ratings: MovieSchema['ratings'] }> {
    let ratings: MovieSchema['ratings'] = [];
    if (!imdbId) {
      return { ratings };
    }

    const res: OMDB.Movie = await this.omdbService.search(imdbId);
    ratings = toRating(res.Ratings ?? []);

    return {
      ratings,
    };
  }

  async addMovie({ userId, movieId }: { userId: string; movieId: number }) {
    let movie = await this.movieService.getMovie(movieId);
    let tmdbMovie: TMDB.Movie;

    if (!movie) {
      tmdbMovie = await this.tmdbService.searchMovieById(movieId);
      tmdbMovie.creationDate = Date.now();
      movie = tmdbMovie;
    }

    movie = {
      ...movie,
      ratings: await this.completeData(movie?.imdb_id).then(d => d.ratings),
    };

    await this.movieService.addMovie(movie);
    await this.collectionService.addMovie(userId, movieId, 'added');
  }

  async refreshMovie(id: number) {
    const tmdbMovie = await this.tmdbService.searchMovieById(id);
    tmdbMovie.creationDate = Date.now();

    const movie: MovieSchema = {
      ...tmdbMovie,
      ratings: await this.completeData(tmdbMovie.imdb_id).then(d => d.ratings),
    };

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

  async getMovies({ userId, filter }: { userId: string; filter: { status: MovieStatus } }) {
    const [movies, collection] = await Promise.all([
      this.movieService.getMovies(),
      this.collectionService.getByUserId(userId),
    ]);

    const status = filter.status;
    const movieIds =
      collection?.movies
        .map(d => ({ id: d.id, status: d.statuses[d.statuses.length - 1] }))
        .filter(d => d.status !== undefined)
        .filter(d => d.status.name === status) ?? [];

    const moviesByIds: Record<string, MovieSchema> = {};
    movies.forEach(movie => {
      moviesByIds[movie.id] = movie;
    });

    const moviesFiltered: { status: MovieStatus; movie: MovieSchema }[] = movieIds.map(id => ({
      movie: moviesByIds[id.id],
      status: id.status.name as MovieStatus,
    }));

    console.log('[status]', status);

    return {
      movies: Object.values(moviesByIds),
      moviesFiltered: moviesFiltered,
      movieIds: movieIds,
      collection,
    };
  }
}

const mediaManagerService = new MediaManagerService(
  tmdbService,
  collectionService,
  movieService,
  serieService,
  omdbService,
);
export { mediaManagerService, MediaManagerService };
