import mongoose from 'mongoose';

import { HabitTypeId } from './habit-config';

interface UserHabit {}

interface UserDTO {
  email: string;
  id: string;
  habits: {
    habitTypeId: HabitTypeId;
    order: number;
  }[];
}

interface IUser extends UserDTO, Document {
  password: string;
}

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Please provide id'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  habits: {
    type: [
      {
        habitTypeId: {
          type: String,
          required: [true, 'Please provide habit type id'],
        },
        order: {
          type: Number,
          required: [true, 'Please provide value'],
        },
      },
    ],
    default: [],
  },
});

const User: mongoose.Model<IUser> = mongoose.models?.Users2 || mongoose.model('Users2', userSchema);

export { User };
export type { UserDTO, UserHabit };
