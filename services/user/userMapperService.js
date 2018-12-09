const phoneNumberService = require('../../services/phoneNumberService');
const randomGeneratorService = require('../../services/randomGeneratorService');
const configs = require('../../configs');

signinReqToCreationParams = (req) => {
    return new Promise((resolve, reject) => {
        try {
            let creationParams = {
                phoneNumber: req.body.phoneNumber,
                normalizedPhoneNumber: phoneNumberService.getNormalizedPhoneNumber(req.body.phoneNumber),
                token: randomGeneratorService.getRandomString(configs.tokenLength, configs.tokenChars),
                smsSent: false
            };
            resolve(creationParams);
        }
        catch(err) {
            reject(err);
        }
    });
}

loginReqToLoginParams = (req) => {
    return new Promise((resolve, reject) => {
        try {
            let loginParams = {
                normalizedPhoneNumber: phoneNumberService.getNormalizedPhoneNumber(req.body.phoneNumber),
                tokenCandidate: req.body.token,
            };
            resolve(loginParams);
        }
        catch(err) {
            reject(err);
        }
    });
}

module.exports = {
    signinReqToCreationParams,
    loginReqToLoginParams
}
