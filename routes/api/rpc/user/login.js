const express = require('express');
const router = express.Router();
const userReqValidatorService = require('../../../../services/user/userReqValidatorService');
const userMapperService = require('../../../../services/user/userMapperService');
const userService = require('../../../../services/user/userService');
const createError = require('http-errors');
const userFirewallService = require("../../../../services/user/userFirewallService");

/* Endpoint for user login */
router.post('/', async (req, res, next) => {
    userFirewallService
        .reqIpOk(req)
        .catch((err) => {
            switch(err.code) {
                case "IP_BLOCKED": // Invalid request
                    return Promise.reject(createError.TooManyRequests(err.message));
                default: // Unexpected error
                    return Promise.reject(createError.InternalServerError(err));
            }
        })
        .then((req) => {
            return userReqValidatorService
                .loginReqOk(req)
                .catch((err) => {
                    switch(err.code) {
                        case "BAD_REQUEST": // Invalid request
                            return Promise.reject(createError.BadRequest(err.message));
                        default: // Unexpected error
                            return Promise.reject(createError.InternalServerError(err));
                    }
                });
        })
        .then((req) => {
            return userMapperService
                .loginReqToLoginParams(req)
                .catch((err) => {
                    switch(err.code){
                        default: // Unexpected error
                        return Promise.reject(createError.InternalServerError(err));
                    }
                });
        })
        .then((loginParams) => {
            return userService
                .login(loginParams)
                .catch((err) => {
                    if("code" in err && err.code == "INVALID_TOKEN") { // Updating userFirewall with new failed attempt
                        return userFirewallService
                            .onUserLoginFailAttempt(req)
                            .then((nAttempts) => {
                                console.log("nAttempts: ", nAttempts);
                            })
                            .catch((onUserLoginFailAttemptErr) => {
                                console.error(onUserLoginFailAttemptErr);
                            })
                            .then(() => {
                                return Promise.reject(err); 
                            });
                    }
                    else {
                        return Promise.reject(err);
                    }
                })
                .catch((err) => {
                    switch(err.code){
                        case "INVALID_TOKEN": // Invalid token
                            return Promise.reject(createError.BadRequest(err.message));
                        default: // Unexpected error
                            return Promise.reject(createError.InternalServerError(err));
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
