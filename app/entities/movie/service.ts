import { MovieSchema, MovieTable } from '../../models/movie.schema';

class MovieService {
  constructor() {}

  async getMovies(): Promise<MovieSchema[]> {
    return await MovieTable.find().exec();
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
