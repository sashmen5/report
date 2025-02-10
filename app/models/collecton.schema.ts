import mongoose, { Model, Schema } from 'mongoose';

interface Collection {
  id: string;
  userId: string;
  creationDate: number;
  movies: Array<{
    id: number;
    statuses: Array<{ name: string; date: number }>;
  }>;
  series: Array<{
    id: number;
    statuses: Array<{ name: string; date: number }>;
  }>;
}

interface CollectionDTO extends Collection, Omit<mongoose.Document, 'id'> {}

// Create a Mongoose schema for Movie
const CollectionSchema = new Schema({
  id: { type: String, required: true, unique: true }, // Unique ID
  userId: { type: String, required: true, unique: true },
  creationDate: { type: Number, required: true },
  movies: {
    type: [
      {
        id: {
          type: Number,
          required: true,
        },
        statuses: {
          type: [
            {
              name: { type: String, required: true },
              date: { type: Number, required: true },
            },
          ],
        },
      },
    ],
    required: true,
  },
  series: {
    type: [
      {
        id: {
          type: Number,
          required: true,
        },
        statuses: {
          type: [
            {
              name: { type: String, required: true },
              date: { type: Number, required: true },
            },
          ],
        },
      },
    ],
    required: true,
  },
});

const CollectionTable: Model<Collection> =
  mongoose.models?.Collections || mongoose.model('Collections', CollectionSchema);

export { CollectionTable };
export type { Collection, CollectionDTO };
