var express = require('express');
var router = express.Router();

/* GET Rooms page. */

router.get('/', function(req, res) {
  res.render('rooms', { title: 'Live Stream Chat - Rooms' });
});

module.exports = router;
