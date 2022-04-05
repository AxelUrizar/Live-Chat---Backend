var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(`App listening on port ${process.env.PORT || '3000'}`)
  res.render('index', { title: 'Express' });
});

module.exports = router;
