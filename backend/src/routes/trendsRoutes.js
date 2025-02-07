// routes for trend-related endpoints
const express = require('express');
const router = express.Router();
const trendsController = require('../controllers/trendsController');

// get pinterest trends
router.get('/trends', trendsController.getTrends.bind(trendsController));

module.exports = router; 