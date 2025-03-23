declare namespace OMDB {
  interface Rating {
    Source: 'Internet Movie Database' | 'Rotten Tomatoes' | 'Metacritic';
    Value: string;
  }

  // [
  //   { Source: 'Internet Movie Database', Value: '8.8/10' },
  //   { Source: 'Rotten Tomatoes', Value: '95%' },
  //   { Source: 'Metacritic', Value: '87/100' }
  // ]

  interface Movie {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Rating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
  }
}
