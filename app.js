"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const parseString = require('xml2js').parseString;
const fs = require('fs'), xml2js = require('xml2js');

const ac = require('./account-creation.js');
const lv = require('./login-verification');
const dbfuns = require('./db-functions.js');
const acc = require('./account.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

// From https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions 
app.use(session({
    cookieName: 'session',
    secret: 'how is it even possible to know that a random string is!?',
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
    "use strict";
    if (!req.session.username) {
        req.session.reset();
        res.redirect('/');
    }
  };

app.get('/', function(req, res) {
    "use strict";
    // TODO: Add XSS Defenses
    res.sendFile(__dirname + "/html/index.html");
});

app.get('/createaccount', function(req, res) {
    "use strict";
    // TODO: Add XSS Defenses
    res.sendFile(__dirname + "/html/createaccount.html");
});

app.post('/createaccount', function(req, res) {
    "use strict";
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
    "use strict";
    async function a() {
        let loginSuccess = true;
        loginSuccess = await lv.verifyLogin(req.body.username, req.body.password, req);
        if (loginSuccess === true) {
            
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
    "use strict";
    requireLogin(req, res);

    res.sendFile(__dirname + "/html/account.html");
    
});

app.get('/accountdata', function(req, res) {
    "use strict";
    async function a() {
        let balances = await acc.getAccountsBalances(req, res)

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(balances);

        res.set('Content-Type', 'text/xml');
        res.send(xml);
    }
    a();
});

app.post('/createaccount', function(req, res) {
    "use strict";

    requireLogin(req, res);

    //redirect for buttons

});


app.post('/withdraw', function(req, res) {
    "use strict";
    requireLogin(req, res);
    console.log(req.body);
    res.set('Content-Type', 'text/javascript')
    res.send("<script>alert('test');</script>");

});

app.post('/deposit', function(req, res) {
    "use strict";
    requireLogin(req, res);

});

app.get('/transfer', function(req, res) {
    "use strict";
    requireLogin(req, res);

});

app.post('/transfer', function(req, res) {
    "use strict";
    requireLogin(req, res);

});

app.listen(port);