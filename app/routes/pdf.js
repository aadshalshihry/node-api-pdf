var express = require('express');
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

const Printer = require('pdfmake')
const axios = require('axios')

var router = express.Router();

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer.alloc(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
  // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
  var bitmap = new Buffer.alloc(base64str, 'base64');
  // write buffer to file
  fs.writeFileSync(file, bitmap);
  console.log('******** File created from base64 encoded string ********');
}

/* GET users listing. */
router.post('/pdf', async function(req, res, next) {

  var printer = new Printer({
    Roboto: {
      normal: path.resolve('src', 'fonts', 'Roboto.ttf'),
      bold: path.resolve('src', 'fonts', 'Roboto-Bold.ttf'),
    }
  });

  try {
    var result = await axios.get('http://via.placeholder.com/350x150', {
      responseType: 'arraybuffer'
    })
  } catch(err) {
    return next(err.message)
  }


  // var image = new Buffer(result.data, 'base64')

  var base64str = base64_encode('../templates_imgs/theme1/page1.png');
  console.log(base64str);

  var doc = printer.createPdfKitDocument({
    pageOrientation: 'landscape',
    background: [
      {
        image: 'data:image/png;base64,',
        width: 792
      }
    ],
    info: {
      title: 'PDF with External Image',
      author: 'Matt Hagemann',
      subject: 'PDF with External Image',
    },
    content: [{
      image: image,
      width: 595, // Full A4 size width.
      absolutePosition: { x: 0, y: 0 }
    }],
    defaultStyle: {
      fontSize: 11,
      font: 'Roboto', // The font name was defined above.
      lineHeight: 1.2,
    }
  })

  doc.end()

  res.setHeader('Content-type', 'application/pdf')
  res.setHeader('Content-disposition', 'inline; filename="Example.pdf"')

  doc.pipe(res)
});

module.exports = router;
