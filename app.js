"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const ac = require('./account-creation.js');
const lv = require('./login-verification');
const dbfuns = require('./db-functions.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

// From https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions 
app.use(session({
    cookieName: 'session',
    secret: 'how is it even possible to know that a randopm string is!?',
    duration: 180000,
    activeDuration: 180000,
    // duration: 30000,
    // activeDuration: 30000,
    httpOnly: true,
    secure: true,
    ephemeral: true
  }));

app.use(function(req, res, next) {
    if (req.session && req.session.username) {
        async function a() {
            let check = await dbfuns.getUser("select * from Users where username = ?", [req.session.username]);
            if (req.session.username === check.username) {
                req.session.user = check.username;  //refresh the session value
                
            };
        }
        a();
        // finishing processing the middleware and run the route
        next();
    } else {
        next();
    }
  });

function requireLogin (req, res) {
    if (!req.session.username) {
        req.session.reset();
        res.redirect('/');
    }
  };

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
            // Start session
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
    requireLogin(req, res);
    //res.send(req.session.username);


    res.sendFile(__dirname + "/html/account.html");
});

app.post('/account', function(req, res) {
    requireLogin(req, res);

});

app.get('/withdraw', function(req, res) {
    requireLogin(req, res);

});

app.post('/withdraw', function(req, res) {
    requireLogin(req, res);

});

app.get('/deposit', function(req, res) {
    requireLogin(req, res);

});

app.post('/deposit', function(req, res) {
    requireLogin(req, res);

});

app.get('/transfer', function(req, res) {
    requireLogin(req, res);

});

app.post('/transfer', function(req, res) {
    requireLogin(req, res);

});

app.listen(port);