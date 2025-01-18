import mongoose from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  id: string;
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
});

const User: mongoose.Model<IUser> = mongoose.models?.Users2 || mongoose.model('Users2', userSchema);

export { User };
