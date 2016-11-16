var express = require('express');
var router = express.Router();

/* GET Rooms page. */

var model = {
  title: "Asiance Hackthon Live!!",
  description: "Asiance and Microsoft get toghther to hack for good. Wed 16 Nov at Microsoft office.", 
  deleted: false, 
  streamurl: "http://livestreamchat.streaming.mediaservices.windows.net/bc9a81e1-14d2-4928-81cf-2eaeb865993e/93a7bea1-e675-4ccc-86d8-898f5b6e6673.ism/manifest"
};

router.get('/', function(req, res) {
  req.session.username = req.query.username;
  res.render('rooms', model);
});

module.exports = router;
