import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // username: {
  //   type: String,
  //   required: [true, 'Please provide username'],
  //   unique: true,
  // },
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

const User = mongoose.models?.Users2 || mongoose.model('Users2', userSchema);

export { User };
