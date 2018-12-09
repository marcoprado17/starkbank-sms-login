const express = require('express');
const router = express.Router();

/* Endpoint for user login */
router.post('/', async (req, res, next) => {
    res.status(200).json({});
});

module.exports = router;
