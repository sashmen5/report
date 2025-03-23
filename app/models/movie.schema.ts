import mongoose, { Document, Schema } from 'mongoose';

export type RatingSource = 'imdb' | 'rotten_tomatoes' | 'popcornmeter' | 'metacritic';

interface IRating {
  source: RatingSource;
  value: string;
}

// Create a Mongoose schema for Genre
const GenreSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

const RATING_TYPES = ['imdb', 'rotten_tomatoes', 'popcornmeter', 'metacritic'];

type Rating = 'imdb' | 'rotten_tomatoes' | 'popcornmeter' | 'metacritic';

export interface MovieSchema {
  adult?: boolean;
  backdrop_path?: string;
  budget?: number;
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
  ratings?: IRating[];

  // Methods
  // addRating(source: RatingSource, value: string): Promise<IMovie>;
  // editRating(source: RatingSource, newValue: string): Promise<IMovie>;
  // deleteRating(source: RatingSource): Promise<IMovie>;
}

interface IMovie extends Omit<MovieSchema, 'id'>, Document {}

// Create a Mongoose schema for Movie
const MovieSchema2 = new Schema<IMovie>({
  adult: { type: Boolean },
  backdrop_path: { type: String },
  budget: { type: Number },
  homepage: { type: String },
  id: { type: Number, required: true, unique: true }, // Unique ID
  imdb_id: { type: String },
  original_language: { type: String },
  original_title: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  poster_path: { type: String },
  release_date: { type: String },
  revenue: { type: Number },
  runtime: { type: Number },
  status: { type: String },
  title: { type: String },
  video: { type: Boolean },
  vote_average: { type: Number },
  vote_count: { type: Number },
  creationDate: { type: Number, required: true },
  ratings: [
    {
      source: {
        type: String,
        enum: RATING_TYPES,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
});

// Create a Mongoose model for Movie and infer the type from the schema
const MovieTable = mongoose.models?.Movies || mongoose.model<IMovie>('Movies', MovieSchema2);

// Infer the type from the schema

export { MovieTable };
