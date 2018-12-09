const express = require('express');
const router = express.Router();
const userReqValidatorService = require('../../../../services/user/userReqValidatorService');
const userMapperService = require('../../../../services/user/userMapperService');
const userService = require('../../../../services/user/userService');
var createError = require('http-errors');

/* Endpoint to register a new user */
router.post('/', async (req, res, next) => {
    userReqValidatorService
        .signinReqOk(req).catch((err) => {
            console.log("err.code:", err.code);
            switch(err.code) {
                case "ERR_ASSERTION": // Invalid request
                    throw createError.BadRequest(err.message);
                default: // Unexpected Error
                    throw createError.InternalServerError(err);
            }
        })
        .then((req) => {
            return userMapperService
                .signinReqToCreationParams(req)
                .catch((err) => { 
                    switch(err.code){
                        default: // Unexpected Error
                            throw createError.InternalServerError(err);
                    }
                });
        })
        .then((creationParams) => {
            return userService
                .create(creationParams)
                .catch((err) => {
                    switch(err.code){
                        case 11000: // Duplicated unique key
                            throw createError.BadRequest(err.message);
                        default: // Unexpected Error
                            throw createError.InternalServerError(err);
                    }
                });
        })
        .then((createdResBody) => {
            res.status(200).json(createdResBody);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
