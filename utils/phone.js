const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const configs = require('../configs');

isValidPhoneNumber = (v) => {
    try {
        const number = phoneUtil.parseAndKeepRawInput(v, configs.regionCode);
        return phoneUtil.isValidNumberForRegion(number, configs.regionCode);
    }
    catch(err) {
        return false;
    }
};

getNormalizedNumber = (rawPhoneNumber) => {
    console.log("getNormalizedNumber chamado");
    console.log("rawPhoneNumber:", rawPhoneNumber);
    try {
        const number = phoneUtil.parseAndKeepRawInput(rawPhoneNumber, configs.regionCode);
        return number.getNationalNumber()
    }
    catch(err) {
        return null;
    }
};

// Must be declared without arrow functions because this is setted by mongoose and arrow functions change the behaviour of this
getNormalizedNumberForMongooseDefault = function() {
    return getNormalizedNumber(this.phoneNumber);
};

module.exports = {
    isValidPhoneNumber,
    getNormalizedNumber,
    getNormalizedNumberForMongooseDefault
};
