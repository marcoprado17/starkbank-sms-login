const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rand = require('../../utils/rand');
const phone = require('../../utils/phone');

const UserSchema = new Schema({
    phoneNumber: {
        type: String,
        validate: {
            validator: (v) => phone.isValidPhoneNumber(v),
            message: () => `Número de telefone inválido. Formatos válidos: (xx) xxxx-xxxx, +55 xx xxxx xxxx, xxxxxxxxxx...`
        },
        required: true
    },
    _normalizedPhoneNumber: {
        type: String,
        default: phone.getNormalizedNumberForMongooseDefault,
        unique: true
    },
    __token: {
        type: String,
        default: () => rand.getRandomToken()
    },
    __smsSent: {
        type: Boolean,
        default: false
    }
});

// Creating indexes
UserSchema.index({ __smsSent: 1 });
UserSchema.index({ _normalizedTel: 1 });

module.exports = mongoose.model('User', UserSchema);
