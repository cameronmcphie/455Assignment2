"use strict";
const dbfuns = require('./db-functions.js');

module.exports = {
    processAccount: async function(username, password, confirmpassword) {

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
    let awaitPromise = await dbfuns.getUser("select * from Users where username = ?", [username]);
    if(awaitPromise !== undefined) {
        return true;
    }
    else {
        return false;
    }
};

function checkConfirmedPassword(password, confirmpassword) {
    if(password === confirmpassword) {
        return true;
    }
    else {
        return false;
    }
};

function createAccount(username, password) {
    dbfuns.createAccountQuery("insert into Users (username, password) values ('" + username +"', '" + password + "');");
}