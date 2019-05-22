var express = require('express');
var router = express.Router();

// Require controller modules.
var ppm_controller = require('../controllers/ppmController');

/* GET home page. */
router.get('/', ppm_controller.ppm_daily);

module.exports = router;
