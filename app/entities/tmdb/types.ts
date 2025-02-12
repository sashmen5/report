declare namespace TMDB {
  interface Paginator<T> {
    page: number;
    total_pages: number;
    total_results: number;
    results?: T[];
  }

  enum MediaType {
    TV = 'tv',
    MOVIE = 'movie',
    PERSON = 'person',
  }

  interface Genre {
    id: number;
    name: string;
  }

  interface MultiSearchResult {
    id: number;
    original_name?: string;
    media_type: MediaType;
    name?: string;
    vote_count?: number;
    vote_average?: number;
    poster_path?: string;
    first_air_date?: string;
    popularity?: number;
    original_title?: string;
    title?: string;
    genre_ids?: number[];
    original_language?: string;
    backdrop_path?: string;
    overview?: string;
    origin_country?: string[];
    release_date?: string;
  }

  export interface Movie {
    adult?: boolean;
    backdrop_path?: string;
    budget?: number;
    genres?: Genre[];
    homepage?: string;
    id: number;
    imdb_id?: string;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    release_date?: string;
    revenue?: number;
    runtime?: number;
    status?: string;
    title?: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
    creationDate: number;
  }

  export interface Season {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }

  export interface Serie {
    seasons: Season[];
    backdrop_path: string;
    episode_run_time: number[];
    first_air_date: string;
    homepage: string;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    name: string;
    next_episode_to_air?: any;
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    status: string;
    tagline: string;
    type: string;
    vote_average: number;
    vote_count: number;
    creationDate: number;
  }

  export interface Season {
    air_date: string;
    episodes: Episode[];
    name: string;
    overview: string;
    id: number;
    poster_path: string;
    season_number: number;
  }

  export interface Episode {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
  }
}
