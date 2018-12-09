const assert = require('assert');
const UserSchema = require('../../database/schemas/UserSchema');

create = (creationParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = new UserSchema(creationParams);
            let createdUser = await UserSchema.create(user);
            let createdResBody = {
                message: `Phone number registered with success. A SMS with a token will be sent to ${createdUser.normalizedPhoneNumber}`
            }
            resolve(createdResBody);
        }
        catch(err) {
            reject(err);
        }
    });
}

login = (loginParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            user = await UserSchema.findOne({"normalizedPhoneNumber": loginParams.normalizedPhoneNumber});
            resolve(user);
        }
        catch(err) {
            reject(err);
        }
    })
    .then((user) => {
        return new Promise((resolve, reject) => {
            try {
                assert(user.token === loginParams.tokenCandidate);
                resolve({
                    "message": "Successful login."
                })
            }
            catch(err) {
                err.message = "Invalid token. Try again."
                err.code = "INVALID_TOKEN"
                reject(err);
            }
        })
    });    
}

module.exports = {
    create,
    login
}
