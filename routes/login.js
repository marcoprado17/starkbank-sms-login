const express = require('express');
const router = express.Router();

/* Endpoint for user login */
router.post('/', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;
