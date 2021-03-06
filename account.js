const sqlite3 = require('sqlite3').verbose();
var xssFilters = require('xss-filters');

module.exports = {
    getAccountsBalances: async function(req, res) {
        "use strict";

        let tmpuserid = req.session.userid
        let db = new sqlite3.Database('bank.db');

        let query = 'select accountid, balance from Accounts where users_userid = ?;';
        
        var results = {};
        var i = 1;
        return new Promise(function(resolve, reject){
            db.all(query, [tmpuserid], (err, row) => {
                if (err) {
                    throw err;
                }
                else {
                    row.forEach((row) => {
                        results['Accountid' + i] = xssFilters.inHTMLData(row.accountid);
                        results['AccountBalance' + i] = xssFilters.inHTMLData(row.balance);
                        i++;
                    });
                }
                //console.log(results);
                resolve(results);
            });
            db.close();
        });
    }
};