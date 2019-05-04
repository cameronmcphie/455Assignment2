const sqlite3 = require('sqlite3').verbose();

module.exports = {
    getAccountsBalances: async function(req, res) {
        "use strict";

        let tmpuserid = req.session.userid
        let db = new sqlite3.Database('bank.db');

        let query = 'select balance from Accounts where users_userid = ?;';
        
        var results = {};
        var i = 1;
        return new Promise(function(resolve, reject){
            db.all(query, [tmpuserid], (err, row) => {
                if (err) {
                    throw err;
                }
                row.forEach((row) => {
                    results['AccountName' + i] = 'Account ' + i;
                    results['AccountBalance' + i] = row.balance;
                    i++;
                });
                console.log(results);
                resolve(results);
            });
            db.close();
        });
    }
};