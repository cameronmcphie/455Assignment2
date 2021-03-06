"use strict";
const express = require('express');
const bodyParser = require('body-parser');
var xmlparser = require('express-xml-bodyparser');
const session = require('client-sessions');
const parseString = require('xml2js').parseString;
const fs = require('fs'), xml2js = require('xml2js');
var xssFilters = require('xss-filters');

const ac = require('./account-creation.js');
const lv = require('./login-verification');
const dbfuns = require('./db-functions.js');
const acc = require('./account.js');
const txn = require('./transaction.js')

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(xmlparser());
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

// From https://medium.com/dailyjs/how-to-prevent-your-node-js-process-from-crashing-5d40247b8ab2
// For taking care of unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
});

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

app.get('/', function(req, res) {
    "use strict";
    req.session.reset();
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
        let accountCreationFulfilled = await ac.processAccount(req, res);

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

app.post('/createbankaccount', async function(req, res) {
    "use strict";

    if(req.session.username) {
        let getUserIdQuery = 'select userid from Users where username = ?';
        let userResults = await dbfuns.getUser(getUserIdQuery, [req.session.username]);

        let query = 'insert into Accounts (users_userid, balance) values (?,0)';
        await dbfuns.performTransaction(query, [userResults.userid]);
        res.redirect('/account');
    }
    else {
        req.session.reset();
        res.redirect('/');
    }
});


app.get('/account', function(req, res) {
    "use strict";

    if(req.session.username) {
        res.sendFile(__dirname + "/html/account.html");
    }
    else {
        req.session.reset();
        res.redirect('/');
    }
    
});


app.get('/accountdata', async function(req, res) {
    "use strict";

    if(req.session.username) {
        let balances = await acc.getAccountsBalances(req, res)
        
        console.log(balances);

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(balances);


        res.set('Content-Type', 'text/xml');
        res.send(xml);
    }
    else {
        req.session.reset();
        res.redirect('/');
    }
});


app.post('/transaction', function(req, res) {
    "use strict";
    //console.log(typeof(req.body.withdraw.accountid[0]));

    //console.log(req.session.username);

    if(req.session.username) {
        txn.accountTransaction(req, res);
    }
    else {
        req.session.reset();
        res.redirect('/');
    }
});

// The logout function your sessions code example
// @param req - the request
// @param res - the response
app.get('/logout', function(req, res) {
    "use strict";
	// Kill the session
	req.session.reset();
	
	res.redirect('/');
});

app.get('/dist/xss-filters.1.2.7.min.js', function(req, res) {
    "use strict";
    res.sendFile(__dirname + '/dist/xss-filters.1.2.7.min.js');
});

app.get('/dist/purify.min.js', function (req, res) {
    "use strict";
    res.sendFile(__dirname + "/dist/purify.min.js");
});

app.listen(port);