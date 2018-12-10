const express = require('express');
const router = express.Router();
const userReqValidatorService = require('../../../../services/user/userReqValidatorService');
const userMapperService = require('../../../../services/user/userMapperService');
const userService = require('../../../../services/user/userService');
const createError = require('http-errors');

/* Endpoint to register a new user */
router.post('/', async (req, res, next) => {
    userReqValidatorService
        .signinReqOk(req)
        .catch((err) => {
            switch(err.code) {
                case "BAD_REQUEST": // Bad request
                    return Promise.reject(createError.BadRequest(err.message));
                default: // Unexpected error
                    return Promise.reject( createError.InternalServerError(err));
            }
        })
        .then((req) => {
            return userMapperService
                .signinReqToCreationParams(req)
                .catch((err) => { 
                    switch(err.code){
                        default: // Unexpected error
                            return Promise.reject(createError.InternalServerError(err));
                    }
                });
        })
        .then((creationParams) => {
            return userService
                .create(creationParams)
                .catch((err) => {
                    switch(err.code){
                        case 11000: // Duplicated unique key
                            return Promise.reject(createError.BadRequest(err.message));
                        default: // Unexpected error
                            return Promise.reject(createError.InternalServerError(err));
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
