const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema of a user
// Fields that start with '_' can't be edited through the api (blockSettingPrivateFieldsExternally)
// Fields that start with '__' are hidden from api responses (removeResponsePrivateFields)
const UserSchema = new Schema({
    phoneNumber: {
        type: String
    },
    _normalizedPhoneNumber: {
        type: String,
        unique: true
    },
    __token: {
        type: String
    },
    __smsSent: {
        type: Boolean
    }
});

// Creating indexes
UserSchema.index({ __smsSent: 1 });
UserSchema.index({ _normalizedTel: 1 });

module.exports = mongoose.model('User', UserSchema);
