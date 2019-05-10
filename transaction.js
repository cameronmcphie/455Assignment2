const sqlite3 = require('sqlite3').verbose();

module.exports = {

    accountTransaction: async function (req, res) {
            "use strict";

            let tmpuserid = req.session.userid
            let db = new sqlite3.Database('bank.db');

            let query = 'select accountid from Accounts where users_accountid=?;';

            var userAccounts = new Promise (function (resolve, reject) {
                //TODO: Check if the user owns the account
            });

            //TODO: Update balance of account 

            res.send('true');
        }

};