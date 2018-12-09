const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema({
    phoneNumber: {
        type: String
    },
    normalizedPhoneNumber: {
        type: String,
        unique: true
    },
    token: {
        type: String
    },
    smsSent: {
        type: Boolean
    }
});

// Creating indexes
UserSchema.index({ smsSent: 1 });
UserSchema.index({ normalizedPhoneNumber: 1 });

module.exports = mongoose.model('User', UserSchema);
