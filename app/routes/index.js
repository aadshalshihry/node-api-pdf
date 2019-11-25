var express = require('express');
var router = express.Router();
var fs = require('fs');
var pdf = require('html-pdf');
var path = require('path');
var Handlebars = require('handlebars');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', function(req, res, next) {
  console.log(__dirname)
  var source = fs.readFileSync('/usr/src/app/templates/theme1.html', 'utf8');
  Handlebars.registerPartial('myPartial', '<h3> 1211بسم الله الرحمن الرحيم </h3>')
  var template = Handlebars.compile(source);
  console.log(template);
  var image = path.join('file://', __dirname, '/images/0.png')
  var context = {
    image: image
  };
  var html    = template(context);

  var options = {
    format: '4A',
    orientation: "landscape",
    border: {
      top: "0px",            // default is 0, units: mm, cm, in, px
      right: "0px",
      bottom: "0px",
      left: "0px"
    },
    base: "file://" + __dirname + '/public/templates_imgs/'
  };

  // var image = path.join('file://', __dirname, '/images/0.png');
  // html = html.replace('{{image}}', image)

  pdf.create(html, options).toFile('./businesscard.pdf', function(err, r) {
    if (err) return console.log(err);
    console.log(r); // { filename: '/app/businesscard.pdf' }
    res.json({
      msg: "Done..."
    })
  });

});

module.exports = router;
