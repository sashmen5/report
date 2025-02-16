import { MovieSchema, MovieTable } from '../../models/movie.schema';

class MovieService {
  constructor() {}

  async getMovies(): Promise<MovieSchema[]> {
    return await MovieTable.find<TMDB.Movie>(
      {},
      {
        id: 1,
        backdrop_path: 1,
        vote_average: 1,
        poster_path: 1,
        release_date: 1,
        original_title: 1,
        title: 1,
        _id: 0, // explicitly exclude _id field
      },
    ).exec();
  }

  async getMovie(id: number | string): Promise<MovieSchema | null> {
    return await MovieTable.findOne({ id: id }).exec();
  }

  async addMovie(movie: MovieSchema): Promise<MovieSchema> {
    return await new MovieTable(movie).save();
  }
}

const movieService = new MovieService();
export { movieService, MovieService };
