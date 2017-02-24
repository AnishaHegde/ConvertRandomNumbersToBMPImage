
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , random = require('random')
  , bmp = require("bmp-js")
  , Png = require('pngjs')
  , fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


//To store values from generateIntegers API call
var bitmapValues = [];

function randomCallback(integers){
    console.log(integers.length);
    for (var i=0; i<integers.length; i++){      
        bitmapValues.push(integers[i][0]);
        console.log(integers[i][0] + " - " + bitmapValues.length);
    }
}

var options = {
    secure: true, // Make the request secure
    num: 10000,      // Get 10 integers
    min: 0,     // Minimum of -10
    max: 255,      // Maximum of 10
    col: 1,       // 2 columns
    base: 10,     // Use Base 16
    rnd: "new" // Which set of random numbers to use
};

function errorCallback(type,code,string){
    console.log("RANDOM.ORG Error: Type: " +type+ ", Status Code: " +code+ ", Response Data: " +string);
}
random.generateIntegers(randomCallback,options,errorCallback);
options.num = 7000;
random.generateIntegers(randomCallback,options,errorCallback);

var processBitmap = function(bm) {
    console.log("Completed with len: " + bm.length);
    var bmpData = {data: bm, width:128, height:128};
    var rawData = bmp.encode(bmpData);
    fs.writeFile('out.bmp', rawData.data);
};

function checklen(){
    if(bitmapValues.length < 16384) {
        console.log("In progress: " + bitmapValues.length);
        setTimeout(checklen, 2000);
    }
    else {
        var bitmapValues2 = bitmapValues.slice(0, 16384);
        console.log("ELSE:" + bitmapValues2.length);
        processBitmap(bitmapValues2);
    }
}
setTimeout(checklen, 2000);