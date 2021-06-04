const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // If you tipe some space after the username, the space will be removed
      minlength: 3, // 3 characters minimum
    },
    password: {
      type: String,
      required: true,
      unique: false,
      trim: false,
      minlength: 8,
    },
  },
  { timestamps: true } // automaticaly create fields when created or when modified
);

const User = mongoose.model('User', userSchema);

module.exports = User;
