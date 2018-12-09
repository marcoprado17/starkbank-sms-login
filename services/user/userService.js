const UserSchema = require('../../database/schemas/UserSchema');

create = (creationParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            let createdResBody = await UserSchema.create(creationParams);
            resolve(createdResBody);
        }
        catch(err) {
            reject(err);
        }
    });
}

module.exports = {
    create
}
