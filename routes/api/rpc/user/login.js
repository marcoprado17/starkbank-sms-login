const express = require('express');
const router = express.Router();
const userReqValidatorService = require('../../../../services/user/userReqValidatorService');
const userMapperService = require('../../../../services/user/userMapperService');
const userService = require('../../../../services/user/userService');
const createError = require('http-errors');

/* Endpoint for user login */
router.post('/', async (req, res, next) => {
    userReqValidatorService
        .loginReqOk(req).catch((err) => {
            switch(err.code) {
                case "BAD_REQUEST": // Invalid request
                    throw createError.BadRequest(err.message);
                default: // Unexpected error
                    throw createError.InternalServerError(err);
            }
        })
        .then((req) => {
            return userMapperService
                .loginReqToLoginParams(req)
                .catch((err) => {
                    switch(err.code){
                        default: // Unexpected error
                            throw createError.InternalServerError(err);
                    }
                });
        })
        .then((loginParams) => {
            return userService
                .login(loginParams)
                .catch((err) => {
                    switch(err.code){
                        case "INVALID_TOKEN": // Invalid token
                            throw createError.BadRequest(err.message);
                        default: // Unexpected error
                            throw createError.InternalServerError(err);
                    }
                });
        })
        .then((loginResBody) => {
            res.status(200).json(loginResBody);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
