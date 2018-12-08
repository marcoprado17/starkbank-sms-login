const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rand = require('../../utils/rand');

const regionCode = 'BR';

const UserSchema = new Schema({
    phoneNumber: {
        type: String,
        validate: {
            validator: (v) => {
                try {
                    const number = phoneUtil.parseAndKeepRawInput(v, regionCode);
                    return phoneUtil.isValidNumberForRegion(number, regionCode);
                }
                catch(err) {
                    return false;
                }
            },
            message: () => `Número de telefone inválido. Formatos válidos: (xx) xxxx-xxxx, +55 xx xxxx xxxx, xxxxxxxxxx...`
        },
        required: true
    },
    _normalizedPhoneNumber: {
        type: String,
        default: function() {
            try {
                const number = phoneUtil.parseAndKeepRawInput(this.tel, regionCode);
                return number.getNationalNumber()
            }
            catch(err) {
                return null;
            }
        },
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
