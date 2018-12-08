const express = require('express');
const router = express.Router();
const UserSchema = require('../database/schemas/UserSchema')

// TODO: Use redis to block signin of the same tel for 5 minutes
/* Endpoint to register a new user */
router.post('/', (req, res, next) => {
  const user = new UserSchema(req.body);
  user.save()
    .then((user) => {
      res
        .status(201)
        .json(user);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(400)
        .json(err);
    })
});

module.exports = router;
