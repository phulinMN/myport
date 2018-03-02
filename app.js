var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
// var db = mongojs('portdb', ['persons','activitydb']);
var db = mongojs('mongodb://heroku_c6c62hmt:u02leonkjcp3kqjq4rdnuncbco@ds153958.mlab.com:53958/heroku_c6c62hmt' || 'portdb', ['persons','activitydb'], { ssl: true});
var ObjectId = mongojs.ObjectId;

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
    res.render('index', {
        title: 'HOME'
    });
});

app.get('/about', function(req, res){
    res.render('about', {
        title: 'About me'
    });
});

app.get('/skill', function(req, res){
    res.render('skill', {
        title: 'Skill'
    });
});

app.get('/activity', function(req, res){
    db.activitydb.find(function (err, acts) {
        res.render('activity', {
            title: "Activity",
            activities: acts
        });
    });
});

app.get('/contact', function(req, res){
    db.persons.find(function (err, docs) {
        console.log(req.query.errors);
        res.render('contact', {
            title: 'Contact',
            persons: docs
        });
    })
});

app.get('/admin', function(req, res){
    db.activitydb.find(function (err, acts) {
        db.persons.find(function (err, docs) {
            // console.log(acts)
            // console.log(req.query.errors);
            res.render('admin', {
                persons: docs,
                activities: acts
            });
        });
    });
});

app.get('/admin/act', function(req, res) {
    // console.log(res.body.res);
    db.activitydb.find(function (err, docs) {
        res.render('create-act',{
            activities: docs
        });
    });
});
app.get('/admin/edit-act', function(req, res) {
    db.activitydb.find(function (err, docs) {
        res.render('edit-act',{
            activities: docs
        });
    });
});

app.post('/admin/edit', function(req, res) {
    console.log('ee');
    res.redirect('/admin');
});

app.post('/admin/act-add', function(req, res) {
    req.checkBody('activity_name', 'Activity is Required').notEmpty();
    req.checkBody('detail', 'Detail is Required').notEmpty();
    var errors = req.validationErrors();
    if(errors) {
        console.log("ERRORS");
        db.activitydb.find(function (err, acts) {
            res.render('create-act', {
                title: 'Activity',
                activities: acts,
                errors: errors
            });
        });
    }
    else {
        var newActivity = {
            activity_name: req.body.activity_name,
            detail: req.body.detail
        }
        db.activitydb.insert(newActivity, function(err, result){
            if(err) {
                console.log(err);
            }
            res.redirect('/admin');
        });
    }
});


app.post('/contact/add', function(req, res) {

    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('phone', 'Phone is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('description', 'Description is Required').notEmpty();

    var errors = req.validationErrors();
    if(errors) {
        db.persons.find(function (err, docs) {
            res.render('contact', {
                title: 'Contact',
                persons: docs,
                errors: errors
            });
        });
    }
    else {
        var newPerson = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            email: req.body.email,
            description: req.body.description
        }
        db.persons.insert(newPerson, function(err, result){
            if(err) {
                console.log(err);
            }
            res.redirect('/contact');
        });
    }
});

app.delete('/admin/contact-delete/:id', function(req, res) {
    console.log(req.params.id);
    db.persons.remove({_id: ObjectId(req.params.id)}, function(err, result){
        if(err){
            console.log(err);
        }
        console.log("########");
        res.redirect('/admin');
    });
});

app.delete('/admin/delete/:id', function(req, res) {
    console.log(req.params.id);
    db.activitydb.remove({_id: ObjectId(req.params.id)}, function(err, result){
        if(err){
            console.log(err);
        }
        console.log("------");
        res.redirect('/admin/#');
    });
});


app.listen(3000, function(){
    console.log('Server Started on Port 3000.....');
})