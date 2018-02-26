var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
// var logger = function(req, res, next){
//     console.log('Logging.....');
//     next();
// }
// app.use(logger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// HOMEPAGE
app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(3000, function(){
    console.log('Server Started on Port 3000.....');
})