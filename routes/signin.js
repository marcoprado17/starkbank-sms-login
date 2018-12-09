const express = require('express');
const router = express.Router();
const UserSchema = require('../database/schemas/UserSchema')
const redisClient = require('../database/redisdb');
const assert = require('assert');

const timeToRenewTokenInSeconds = 300;

/* Endpoint to register a new user */
router.post('/', async (req, res, next) => {
  let user = new UserSchema(req.body);
  try {
    // Trying to create a new user
    await user.save();
    // Adding to redis a key with a ttl timeToRenewTokenInSeconds to know when the token can be regenerated
    await redisClient.set(`normalizedPhoneNumberTokenCreation${user._normalizedPhoneNumber}`, true, 'EX', timeToRenewTokenInSeconds);
    res
        .status(201)
        .json(user);
  }
  // Fail to create user. Probably, a user with that phoneNumber already exists; in this case a new token will be generated
  catch(err) {
    console.log(err);
    try {
      let ttl = await redisClient.ttl(`normalizedPhoneNumberTokenCreation${user._normalizedPhoneNumber}`);
      if(ttl > 0) {
        return res
          .status(400)
          .json({
            message: `Token generated recently. In ${ttl} second(s) a new token can be generated and sent to the phone number ${user._normalizedPhoneNumber}`
          });
      }
      // Trying to update the token of an existent user and send a new SMS with the new token
      await UserSchema.findOneAndUpdate(
        { _normalizedPhoneNumber: user._normalizedPhoneNumber },
        {
          __token: user.__token,
          __smsSent: false
        },
        { upsert: false, new: true, runValidators: true }
      );
      // Adding to redis a key with a ttl timeToRenewTokenInSeconds to know when the token can be regenerated
      await redisClient.set(`normalizedPhoneNumberTokenCreation${user._normalizedPhoneNumber}`, true, 'EX', timeToRenewTokenInSeconds);
      res
        .status(200)
        .json({
          message: `A new token was generated and sent to the phone number: ${user._normalizedPhoneNumber}`
        });
    }
    catch(err) {
      res
        .status(500)
        .json({
          message: err.message
        });
    }
  }
});

module.exports = router;
