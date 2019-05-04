const dbfuns = require('./db-functions.js');

module.exports = {
    processAccount: async function(username, password, confirmpassword) {
        "use strict";
        if(await checkIfUsernameExists(username) === true) {
            return false;
        }
        if(checkConfirmedPassword(password, confirmpassword) === false) {
            return false;
        }
        createAccount(username, password);
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

function createAccount(username, password) {
    "use strict";
    dbfuns.createAccountQuery("insert into Users (username, password) values ('" + username +"', '" + password + "');");
}