import mongoose, { Model, Schema } from 'mongoose';

interface SeasonStatus {
  id: number;
  serieId: number;
  episodes?: Map<number | string, { id: number; date: number }>;
}

interface SeasonSerializable {
  id: number;
  serieId: number;
  episodes?: { [key: number]: { id: number; date: number } };
}

interface SeasonDTO extends SeasonStatus, Omit<mongoose.Document, 'id'> {}

const SeasonSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  serieId: {
    type: Number,
    required: true,
  },
  episodes: {
    type: Map,
    of: {
      id: {
        type: Number,
        required: true,
      },
      date: {
        type: Number,
        required: false,
      },
    },
    required: false,
  },
});

const SeasonTable: Model<SeasonDTO> = mongoose.models?.Seasons || mongoose.model('Seasons', SeasonSchema);

export { SeasonTable };
export type { SeasonStatus, SeasonDTO, SeasonSerializable };
