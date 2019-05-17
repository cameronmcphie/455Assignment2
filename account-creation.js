const dbfuns = require('./db-functions.js');
var bleach = require('bleach');

module.exports = {
    processAccount: async function(req, res) {
        "use strict";
        let username = bleach.sanitize(req.body.username);
        let password = bleach.sanitize(req.body.password);
        let confirmpassword = bleach.sanitize(req.body.confirmpassword);
        let firstname = bleach.sanitize(req.body.firstname);
        let lasname = bleach.sanitize(req.body.lastname);
        let address = bleach.sanitize(req.body.address);

        console.log(username);

        if(await checkIfUsernameExists(username) === true) {
            // Did not specify that username exists as that can be exploited
            res.send("<html><body><script>alert('Could not create account');</script></body></html>");
        }
        if(checkConfirmedPassword(password, confirmpassword) === false) {
            res.send("<html><body><script>alert('Please check that you've entered and confirmed your password');</script></body></html>");
        }
        else {
            createAccount(username, password, firstname, lasname, address);
            return true;
        }
    }
};

async function checkIfUsernameExists(username) {
    "use strict";
    let awaitPromise = await dbfuns.getUser("select * from Users where username = ?", [username]);
    console.log(awaitPromise)
    // If username exists
    if(awaitPromise !== undefined) {
        return true;
    }
    else {
        return false;
    }
};

function checkConfirmedPassword(password, confirmpassword) {
    "use strict";
    if(password === confirmpassword) {
        return true;
    }
    else {
        return false;
    }
};

function createAccount(username, password, firstname, lasname, address) {
    "use strict";
    let query = "INSERT INTO Users (username, password, firstname, lastname, address) VALUES (?, ?, ?, ?, ?)";
    let params = [username, password, firstname, lasname, address];

    dbfuns.createAccountQuery(query, params);
}