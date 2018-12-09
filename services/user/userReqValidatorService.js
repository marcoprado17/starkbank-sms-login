const assert = require('assert');
const reqValidatorService = require('../../services/reqValidatorService');
const phoneNumberService = require('../../services/phoneNumberService');
const UserSchema = require('../../database/schemas/UserSchema');

signinReqOk = (req) => {
    return new Promise((resolve, reject) => {
        try {
            reqValidatorService.assertHasField(req.body, "phoneNumber", "string");
            phoneNumberService.assertValidPhoneNumber(req.body.phoneNumber);
            resolve(req);
        }
        catch(err) {
            let badSigninReqErr = new Error(err);
            badSigninReqErr.code = "BAD_REQUEST";
            reject(badSigninReqErr);
        }
    });
}

// TODO: Request validator could return and object containing the request and additional properties like the user fetched
loginReqOk = (req) => {
    return new Promise((resolve, reject) => {
        try {
            reqValidatorService.assertHasField(req.body, "phoneNumber", "string");
            phoneNumberService.assertValidPhoneNumber(req.body.phoneNumber);
            let normalizedPhoneNumber = phoneNumberService.getNormalizedPhoneNumber(req.body.phoneNumber);
            resolve(normalizedPhoneNumber);
        }
        catch(err) {
            err.code = "BAD_REQUEST";
            reject(err);
        }
    })
    .then((normalizedPhoneNumber) => {
        return new Promise(async (resolve, reject) => {
            try {
                user = await UserSchema.findOne({"normalizedPhoneNumber": normalizedPhoneNumber});
                resolve({user, normalizedPhoneNumber})
            }
            catch(err) {
                reject(err);
            }
        });
    })
    .then(({user, normalizedPhoneNumber}) => {
        return new Promise((resolve, reject) => {
            try {
                assert(user !== null, `User with the phone number provided (${normalizedPhoneNumber}) not found.`);
                resolve(req);
            }
            catch(err) {
                err.code = "BAD_REQUEST";
                reject(err);
            }
        });
    })
    .then((req) => {
        return new Promise((resolve, reject) => {
            try {
                reqValidatorService.assertHasField(req.body, "token", "string");
                resolve(req);
            }
            catch(err) {
                err.code = "BAD_REQUEST";
                reject(err);
            }
        });
    });
}

module.exports = {
    signinReqOk,
    loginReqOk
}
