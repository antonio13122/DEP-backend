const mongoose = require("mongoose");

// Define a schema for User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
