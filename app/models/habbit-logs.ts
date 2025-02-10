import mongoose from 'mongoose';

import { HabitTypeId } from './habit-config';

interface HabitLogDTO {
  id: string;
  userId: string;
  date: string;
  habits: {
    habitTypeId: HabitTypeId;
    value: number | string | boolean;
  }[];
  createdAt: Date;
}

interface IHabitLog extends HabitLogDTO, Omit<mongoose.Document, 'id'> {}

const habitLogs = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Please provide id'],
    unique: true,
  },
  userId: {
    type: String,
    required: [true, 'Please provide user id'],
  },
  date: {
    type: String,
    required: [true, 'Please provide date'],
  },
  habits: {
    type: [
      {
        habitTypeId: {
          type: String,
          required: [true, 'Please provide habit type id'],
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
          required: [true, 'Please provide value'],
        },
      },
    ],
    required: [true, 'Please provide habits'],
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

const HabitLog: mongoose.Model<IHabitLog> =
  mongoose.models?.HabitLogs || mongoose.model('HabitLogs', habitLogs);

export { HabitLog, type IHabitLog, type HabitLogDTO };
