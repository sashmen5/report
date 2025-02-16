class TMDBEntity {
  buildPosterImgPath(path: string, width: '200' | '300' | '400' = '300') {
    return `https://image.tmdb.org/t/p/w${width}/${path}`;
  }
}

const tmdbEntity = new TMDBEntity();

export { tmdbEntity };
