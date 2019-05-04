const dbfuns = require('./db-functions.js');

module.exports = {
    verifyLogin: async function(username, password, req) {
        "use strict";
        if(await checkIfUsernameExists(username) === false) {
            return false;
        }
        let dbrow = await dbfuns.getUser("select * from Users where username = ?", [username]);

        req.session.userid = dbrow.userid;

        if (password === dbrow.password) {
            return true;
        }
        else {
            return false;
        }
    }
};
// Returns true if username is found else false
async function checkIfUsernameExists(username) {
    let awaitPromise = false;
    awaitPromise = await dbfuns.getUser("select * from Users where username = ?", [username]);
    if(awaitPromise !== undefined) {
        return true;
    }
    else {
        return false;
    }
};