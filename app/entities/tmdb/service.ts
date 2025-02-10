import axios from 'redaxios';

export enum SearchLanguage {
  RU = 'ru-RU',
  EN = 'en-US',
  UA = 'uk-UA',
}

class TMDBService {
  constructor() {}

  buildPosterImgPath(path: string, width: '200' | '300' | '400' = '300') {
    return `https://image.tmdb.org/t/p/w${width}/${path}`;
  }

  async search(query: string, searchLanguage: SearchLanguage = SearchLanguage.EN) {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&language=${searchLanguage}&query=${query}&page=1&include_adult=true`;
    const result = await axios.get<TMDB.Paginator<TMDB.MultiSearchResult>>(url);
    return result.data;
  }

  async searchMovieById(id: number | string, searchLanguage: SearchLanguage = SearchLanguage.EN) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=${searchLanguage}`;
    const result = await axios.get<Promise<TMDB.Movie>>(url);
    return result.data;
  }
}

const tmdbService = new TMDBService();

export { tmdbService, TMDBService };
