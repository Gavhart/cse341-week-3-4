const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Check if the model exists using mongoose.models to avoid recompilation error
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);