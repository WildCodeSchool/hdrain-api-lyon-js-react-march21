const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // If you tipe some space after the username, the space will be removed
  },
  hashedPassword: {
    type: Object,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
