import { MovieSchema, RatingSource } from '../../models';

function isValidType(type: string): type is OMDB.Rating['Source'] {
  // return type === 'imdb' || type === 'rotten_tomatoes' || type === 'metacritic';
  return ['Internet Movie Database', 'Rotten Tomatoes', 'Metacritic'].includes(type);
}

function toRatingType(type: OMDB.Rating['Source']): RatingSource {
  switch (type) {
    case 'Internet Movie Database':
      return 'imdb';
    case 'Rotten Tomatoes':
      return 'rotten_tomatoes';
    case 'Metacritic':
      return 'metacritic';
  }
}

function toRating(ratings: OMDB.Rating[] = []): MovieSchema['ratings'] {
  return ratings
    .filter(d => isValidType(d.Source))
    .map(d => ({ source: toRatingType(d.Source), value: d.Value }));
}

export { toRating };
