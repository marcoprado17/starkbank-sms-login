const configs = require('../configs');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

assertValidPhoneNumber = (phoneNumber) => {
    let invalidPhoneNumberErr = new Error("Número de telefone inválido. Formatos aceitos: xx xxxxxxxxx, xxxxxxxxxxx, +55 (xx) xxxxx-xxxx, 55 xx xxxxx xxxx, 55 xxxxxxxxxxx...");
    invalidPhoneNumberErr.code = "ERR_ASSERTION";
    try {
        const number = phoneUtil.parseAndKeepRawInput(phoneNumber, configs.regionCode);
        const isValidNumberForRegion = phoneUtil.isValidNumberForRegion(number, configs.regionCode);
        if(!isValidNumberForRegion) {
            throw invalidPhoneNumberErr;
        }
    }
    catch(err) {
        throw invalidPhoneNumberErr;
    }
};

getNormalizedPhoneNumber = (rawPhoneNumber) => {
    const number = phoneUtil.parseAndKeepRawInput(rawPhoneNumber, configs.regionCode);
    return number.getNationalNumber()
};

module.exports = {
    assertValidPhoneNumber,
    getNormalizedPhoneNumber,
};
