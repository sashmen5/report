import { Serie, SerieTable } from '../../models/serie.schema';

class SerieService {
  constructor() {}

  async getSeries(): Promise<Serie[]> {
    return await SerieTable.find().exec();
  }

  async getById(id: number | string): Promise<Serie | null> {
    return await SerieTable.findOne({ id: id }).exec();
  }

  async add(serie: Serie): Promise<Serie> {
    return await new SerieTable(serie).save();
  }

  async delete(id: number) {
    return await SerieTable.deleteOne({ id: id }).exec();
  }

  convertToSerie(tmdbSerie: TMDB.Serie): Serie {
    return {
      creationDate: tmdbSerie.creationDate,
      seasons:
        tmdbSerie?.seasons?.map(el => ({
          name: el.name,
          id: el.id,
          airDate: el.air_date,
          episodeCount: el.episode_count,
          seasonNumber: el.season_number,
          posterPath: el.poster_path,
          overview: el.overview,
        })) || [],
      inProduction: tmdbSerie.in_production,
      lastAirDate: tmdbSerie.last_air_date,
      backdropPath: tmdbSerie.backdrop_path,
      episodeRunTime: tmdbSerie.episode_run_time,
      firstAirDate: tmdbSerie.first_air_date,
      homepageUrl: tmdbSerie.homepage,
      name: tmdbSerie.name,
      originalName: tmdbSerie.original_name,
      overview: tmdbSerie.overview,
      posterPath: tmdbSerie.poster_path,
      id: tmdbSerie.id,
      popularity: tmdbSerie.popularity,
      status: tmdbSerie.status,
      type: tmdbSerie.type,
      voteAverage: tmdbSerie.vote_average,
      voteCount: tmdbSerie.vote_count,
    };
  }
}

const serieService = new SerieService();
export { serieService, SerieService };
