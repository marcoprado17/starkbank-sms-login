const express = require('express');
const router = express.Router();
const assert = require('assert');
const phone = require('../services/phoneService');
const UserSchema = require('../database/schemas/UserSchema');
const requestIp = require('request-ip');
const redisClient = require('../database/redisdb');

const nAttemptsPerIp = 10;
const timeToResetIps = 300;

function BlockedIpException() {
    this.message = "Login blocked."
}

/* Endpoint for user login */
router.post('/', async (req, res, next) => {
    // Getting client ip and data from redis about that ip
    const clientIp = requestIp.getClientIp(req);
    const ttl = await redisClient.ttl(`ipLogin${clientIp}`);
    const currIpAttempt = await redisClient.get(`ipLogin${clientIp}`);
    try {
        // Checking if ip not already exceeded the max number of login attempts
        if(ttl > 0 && currIpAttempt !== null && currIpAttempt >= nAttemptsPerIp-1) {
            throw new BlockedIpException();
        }
        // phoneNumber validation
        assert('phoneNumber' in req.body, `Obrigatory field: phoneNumber.`);
        let phoneNumber = req.body.phoneNumber;
        assert(typeof phoneNumber === String, `phoneNumber must be of string type`);
        assert(phone.isValidPhoneNumber(phoneNumber), `Invalid phoneNumber.`);
        let normalizedPhoneNumber = phone.getNormalizedNumber(phoneNumber);
        let user = await UserSchema.findOne({
            _normalizedPhoneNumber: normalizedPhoneNumber
        });
        assert(user !== null, `User with provided phoneNumber not found.`);
        // token validation
        assert('token' in req.body, `Obrigatory field: token.`);
        let token = req.body.token;
        assert(typeof token === String, `token must be of string type`);
        assert(token === user.__token, `Provided token is invalid.`);
        res
            .status(200)
            .json({
                message: "Successful login"
            });
    }
    catch (err) {
        let ipLimitMessage = "";
        if(ttl < 0 || currIpAttempt === null) {
            await redisClient.set(`ipLogin${clientIp}`, 1,'EX', timeToResetIps);
            let nRemainingAttemptsOfIp = nAttemptsPerIp-1;
            ipLimitMessage = ` Your ip (${clientIp}) have only ${nRemainingAttemptsOfIp} attempts remaining to login.`;
        }
        else {
            if(currIpAttempt < nAttemptsPerIp-1) {
                nRemainingAttemptsOfIp = nAttemptsPerIp-1-currIpAttempt;
                ipLimitMessage = ` Your ip (${clientIp}) have only ${nRemainingAttemptsOfIp} attempts remaining to login.`;
                await redisClient.incr(`ipLogin${clientIp}`);
            }
            else {
                ipLimitMessage = ` Your ip (${clientIp}) exceeded the limit of fail login attempts (${nAttemptsPerIp}). You must wait for ${ttl} second(s) to try again.`;
            }
        }
        res
            .status(400)
            .json({
                message: err.message + ipLimitMessage
            });
    }
});

module.exports = router;
