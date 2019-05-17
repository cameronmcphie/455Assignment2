const dbfuns = require('./db-functions.js');

module.exports = {
    processAccount: async function(req) {
        "use strict";
        let username = req.body.username;
        let password = req.body.password;
        let confirmpassword = req.body.confirmpassword;
        let firstname = req.body.firstname;
        let lasname = req.body.lastname;
        let address = req.body.address;

        if(await checkIfUsernameExists(username) === true) {
            return false;
        }
        if(checkConfirmedPassword(password, confirmpassword) === false) {
            return false;
        }
        createAccount(username, password, firstname, lasname, address);
        return true;
    }
};

async function checkIfUsernameExists(username) {
    "use strict";
    let awaitPromise = await dbfuns.getUser("select * from Users where username = ?", [username]);
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