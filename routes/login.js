const express = require('express');
const router = express.Router();
const assert = require('assert');
const phone = require('../utils/phone');
const UserSchema = require('../database/schemas/UserSchema');

/* Endpoint for user login */
router.post('/', async (req, res, next) => {
    try {
        console.log('req.body:', req.body);
        // phoneNumber validation
        assert('phoneNumber' in req.body, `Obrigatory field: phoneNumber`);
        assert(phone.isValidPhoneNumber(req.body.phoneNumber), `Invalid phoneNumber`);
        let user = await UserSchema.findOne({
            _normalizedPhoneNumber: normalizedPhoneNumber
        });
        assert(user !== null, `User with provided phoneNumber not found`);
        // token validation
        assert('token' in req.body, `Obrigatory field: token`);
        let normalizedPhoneNumber = phone.getNormalizedNumber(req.body.phoneNumber);
        assert(req.body.token === user.__token, `Provided token is invalid. Try again.`);
        res
            .status(200)
            .json({
                message: "Successful login"
            });
    }
    catch (err) {
        console.error(err);
        res
            .status(400)
            .json({
                message: err.message
            });
    }
});

module.exports = router;
