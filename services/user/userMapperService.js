const phoneNumberService = require('../../services/phoneNumberService');
const randomGeneratorService = require('../../services/randomGeneratorService');
const configs = require('../../configs');

signinReqToCreationParams = (req) => {
    return new Promise((resolve, reject) => {
        try {
            let creationParams = {
                phoneNumber: req.body.phoneNumber,
                _normalizedPhoneNumber: phoneNumberService.getNormalizedPhoneNumber(req.body.phoneNumber),
                __token: randomGeneratorService.getRandomString(configs.tokenLength, configs.tokenChars),
                __smsSent: false
            };
            resolve(creationParams);
        }
        catch(err) {
            reject(err);
        }
    });
}

SIGNIN_REQ_TO_CREATION_PARAMS_ERROR_CODES = {

}

module.exports = {
    signinReqToCreationParams,
    SIGNIN_REQ_TO_CREATION_PARAMS_ERROR_CODES
}
