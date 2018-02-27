var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('portdb', ['persons']);

var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Global Vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// HOMEPAGE
app.get('/', function(req, res){
    db.persons.find(function (err, docs) {
        // console.log(docs);
        res.render('index', {
            title: 'HOME'
        });
    })
});

app.get('/about', function(req, res){
    db.persons.find(function (err, docs) {
        // console.log(docs);
        res.render('about', {
            title: 'About me'
        });
    })
});

app.get('/skill', function(req, res){
    db.persons.find(function (err, docs) {
        // console.log(docs);
        res.render('skill', {
            title: 'Skill'
        });
    })
});

app.get('/activity', function(req, res){
    db.persons.find(function (err, docs) {
        // console.log(docs);
        res.render('activity', {
            title: 'Activity'
        });
    })
});

app.get('/contact', function(req, res){
    db.persons.find(function (err, docs) {
        // console.log(docs);
        res.render('contact', {
            title: 'Contact',
            persons: docs
        });
    })
});

app.post('/contact/persons/add', function(req, res) {
    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();

    var errors = req.validationErrors();
    if(errors) {
        res.render('index', {
            title: 'Contact',
            persons: persons,
            errors: errors
        });
        console.log('ERRORS');
    }
    else {
        var newPerson = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        db.persons.insert(newPerson, function(err, result){
            if(err) {
                console.log(err);
            }
            res.redirect('/');
        });
    }
});



app.listen(3000, function(){
    console.log('Server Started on Port 3000.....');
})