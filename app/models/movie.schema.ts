import mongoose, { Document, Schema } from 'mongoose';

// Create a Mongoose schema for Genre
const GenreSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

// Create a Mongoose schema for Movie
const MovieSchema = new Schema({
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
});

// Create a Mongoose model for Movie and infer the type from the schema
const MovieTable = mongoose.models?.Movies || mongoose.model('Movies', MovieSchema);

// Infer the type from the schema
type MovieSchema = mongoose.InferSchemaType<typeof MovieSchema>;
type MovieDocument = Document & mongoose.InferSchemaType<typeof MovieSchema>;

export { MovieTable, MovieDocument };
export type { MovieSchema };
