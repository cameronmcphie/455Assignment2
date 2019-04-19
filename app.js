"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const ac = require('./account-creation.js');
const lv = require('./login-verification');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

// From https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions 
app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 180000,
    activeDuration: 180000,
    httpOnly: true,
    secure: true,
    ephemeral: true
  }));

  var sessionMiddleware = app.use(function(req, res, next) {
    if (req.session && req.session.user) {
      User.findOne({ email: req.session.user.email }, function(err, user) {
        if (user) {
          req.user = user;
          req.session.user = user;  //refresh the session value
          res.locals.user = user;
        }
        // finishing processing the middleware and run the route
        next();
      });
    } else {
      next();
    }
  });

app.get('/', function(req, res) {
    // TODO: Add XSS Defenses
    res.sendFile(__dirname + "/html/index.html");
});

app.get('/createaccount', function(req, res) {
    // TODO: Add XSS Defenses
    res.sendFile(__dirname + "/html/createaccount.html");
});

app.post('/createaccount', function(req, res) {
    // TODO: Sanatize inputs
    async function a() {
        let accountCreationFulfilled = await ac.processAccount(req.body.username, req.body.password, req.body.confirmpassword);

        if (accountCreationFulfilled === false) {
            res.redirect('/createaccount');
        }
        else if (accountCreationFulfilled === true) {
            res.redirect('/');
        }
        else {
            res.redirect('/createaccount');
        }
    }
    a();
});

app.post('/login', function (req, res) {


    async function a() {
        let loginSuccess = true;
        loginSuccess = await lv.verifyLogin(req.body.username, req.body.password);
        if (loginSuccess === true) {
            // TODO: setup session management
            req.session.username = req.body.username;
            res.redirect('/account');
        }
        else {
            res.redirect('/');
        }
    }
    a();

});

app.get('/account', function(req, res) {
    res.send();
    //res.sendFile(__dirname + "/html/account.html");
});

app.post('/account', function(req, res) {

});

app.get('/withdraw', function(req, res) {

});

app.post('/withdraw', function(req, res) {

});

app.get('/deposit', function(req, res) {

});

app.post('/deposit', function(req, res) {

});

app.get('/transfer', function(req, res) {

});

app.post('/transfer', function(req, res) {

});

app.listen(port);