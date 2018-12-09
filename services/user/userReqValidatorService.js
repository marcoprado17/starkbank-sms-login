const reqValidatorService = require('../../services/reqValidatorService');
const phoneNumberService = require('../../services/phoneNumberService');

signinReqOk = (req) => {
    return new Promise((resolve, reject) => {
        try {
            reqValidatorService.assertHasField(req.body, "phoneNumber", "string");
            phoneNumberService.assertValidPhoneNumber(req.body.phoneNumber);
            resolve(req);
        }
        catch(err) {
            reject(err);
        }
    });
}

module.exports = {
    signinReqOk
}
