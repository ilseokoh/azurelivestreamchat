var express = require('express');
var router = express.Router();

/* GET chat page. */

router.get('/', function(req, res) {
  res.render('chat', { title: 'Live Stream Chat - Chat' });
});

module.exports = router;