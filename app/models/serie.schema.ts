import mongoose, { Schema } from 'mongoose';

interface Serie {
  episodeRunTime: number[];
  seasons: {
    id: number;
    airDate: string;
    episodeCount: number;
    name: string;
    overview: string;
    posterPath: string;
    seasonNumber: number;
  }[];
  id: number;
  backdropPath: string;
  firstAirDate: string;
  homepageUrl: string;
  inProduction: boolean;
  lastAirDate: string;
  name: string;
  originalName: string;
  overview: string;
  popularity: number;
  posterPath: string;
  status: string;
  type: string;
  voteAverage: number;
  voteCount: number;
  creationDate: number;
}

interface SerieDTO extends Serie, Omit<mongoose.Document, 'id'> {}

const SerieSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // Unique ID
  backdropPath: { type: String },
  homepageUrl: { type: String },
  inProduction: { type: Boolean },
  lastAirDate: { type: String },
  firstAirDate: { type: String },
  name: { type: String },
  originalName: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  posterPath: { type: String },
  status: { type: String },
  type: { type: String },
  voteAverage: { type: Number },
  voteCount: { type: Number },
  creationDate: { type: Number, required: true },

  episodeRunTime: {
    type: [Number],
  },
  seasons: {
    type: [
      {
        id: { type: Number },
        airDate: { type: String },
        episodeCount: { type: Number },
        name: { type: String },
        overview: { type: String },
        posterPath: { type: String },
        seasonNumber: { type: Number },
      },
    ],
  },
});

const SerieTable = mongoose.models?.Series || mongoose.model('Series', SerieSchema);

export { SerieTable };
export type { Serie };
