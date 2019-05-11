const sqlite3 = require('sqlite3').verbose();

module.exports = {

    accountTransaction: async function (req, res) {
        "use strict";

        let query = 'select accountid from Accounts where users_userid=?;';

        var doesBelongToUser = await checkIfAccountBelongsToUser(req, query);

        if (!doesBelongToUser) {
            res.send('false');
        }
        else {
            //TODO: Update balance of account
            let body = req.body.transaction;

            

            res.send('true');
        }
            
    }
};

function checkIfAccountBelongsToUser(req, query) {
    return new Promise (function (resolve, reject) {
        "use strict";

        let tmpuserid = req.session.userid
        let db = new sqlite3.Database('bank.db');
                
        var accountBelongstoUser = false;

        db.all(query, [tmpuserid], (err, row) => {
            if (err) {
                throw err;
            }
            else {
                row.forEach((row) => {
                    // TODO get account id
                    if(row.accountid == req.body.transaction.accountid[0]) {
                        accountBelongstoUser = true;
                    }
                });
                resolve(accountBelongstoUser);
            }
        });
        db.close();
    });
}