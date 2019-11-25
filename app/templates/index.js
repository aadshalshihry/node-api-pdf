var express = require('express');
// var router = express.Router();
var fs = require('fs');
var pdf = require('html-pdf');
var path = require('path');
// var partails = require('./theme1/partial_register_funs');
var ejs = require('ejs');
let { execSync: exec } = require('child_process');


module.exports = function(app) {
  app.post('/api/reports/pdf/fanoos', function(req, res, next) {
    console.log("********************************", req.body.wordscloud)
    var dir = __dirname;
    var source = fs.readFileSync(__dirname + '/theme1/index.ejs', 'utf8');
    let ar_word_num;

    buf = exec(`python3 ${dir}/utils/numberToStringAr.py ${req.body.tweets_num} ${req.body.tweeps_num}`);
    let bufferOne = Buffer.from(buf, 'utf-8')
    let json = JSON.stringify(bufferOne);
    let bufferOriginal = Buffer.from(JSON.parse(json).data);
    ar_word_num = bufferOriginal.toString('utf8').replace(/\[?]?'*'*/g, '')
    ar_word_num = ar_word_num.replace('\n', '')
    ar_word_num = ar_word_num.split(',');

    for (let i = 0; i > ar_word_num.length; i++) {
      ar_word_num[i].replace('\n', '')
    }
    let wordcloudCount = JSON.stringify(req.body.wordscloud)
    buf = exec(`python3 ${dir}/utils/wc.py ${wordcloudCount}`);
    bufferOne = Buffer.from(buf, 'utf-8')
    json = JSON.stringify(bufferOne);
    bufferOriginal = Buffer.from(JSON.parse(json).data);
    worldCloudImage = bufferOriginal.toString('utf8')


    var options = {
      format: '4A',
      orientation: "landscape",
      timeout: '100000',
      border: {
        top: "0px",            // default is 0, units: mm, cm, in, px
        right: "0px",
        bottom: "0px",
        left: "0px"
      },
    };

    let page4ChartData = [];
    for(let i = 0; i < req.body.statistics.tweets.labels.length; i++) {
      let tempArr = [];
      tempArr[0] = req.body.statistics.tweets.labels[i];
      tempArr[1] = parseInt(req.body.statistics.tweets.values[i]);
      page4ChartData.push(tempArr);
    }

    let page6ChartLable = [];
    let page6ChartValue = [];
    for(let i = 0; i < req.body.tweet_during_day.length; i++) {
      page6ChartLable.push(req.body.tweet_during_day[i]['data'])
      page6ChartValue.push(req.body.tweet_during_day[i]['count'])
    }

    var compiled = ejs.compile(source, {sourceMap: true});
    var html = compiled({
      data: req.body,
      dir: `${__dirname}/theme1`,
      dir_file: `file:///${__dirname}/theme1`,
      ar_word_num,
      pageNum: 0,
      worldCloudImage,
      page4Chart: JSON.stringify(page4ChartData),
      page6ChartLable: JSON.stringify(page6ChartLable),
      page6ChartValue: JSON.stringify(page6ChartValue),
      page7Chart: JSON.stringify(req.body.sentiment)
    });

    // pdf.create(html, options).toBuffer(function(err, buffer){/home/roman/workplace/pdf-generator/app/foo.pdf
    //   res.json({
    //     data: buffer
    //   })
    // });

    pdf.create(html, options).toStream(function(err, stream) {
      if (err) return console.log("ERROR", err);

      stream.pipe(res);
      // res.setHeader('Content-disposition', 'inline; filename="Test.pdf"');
      // res.setHeader('Content-type', 'application/pdf');
      // stream.pipe(fs.createWriteStream('./foo.pdf'))
      // var readStream = fs.createReadStream('./foo.pdf');
      // readStream.pipe(res);
      // res.send(stream.pipe(fs.createWriteStream('./foo.pdf')));
    });

    // pdf.create(html, options).toFile('./businesscard.pdf', function(err, r) {
    //   if (err) return console.log("ERROR", err);
    //
    //   res.json({
    //     msg: "Done..."
    //   })
    // });
  });
};

