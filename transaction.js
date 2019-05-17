const sqlite3 = require('sqlite3').verbose();
const dbfuns = require('./db-functions.js');

module.exports = {

    accountTransaction: async function (req, res) {
        "use strict";

        let query = 'select accountid from Accounts where users_userid=?;';

        var doesBelongToUser = await checkIfAccountBelongsToUser(req, query);

        if (!doesBelongToUser) {
            res.set('Content-Type', 'text/xml');
            res.send('false');
        }
        else {
            //TODO: Update balance of account
            let transactionType = req.body.transaction.action[0];
            let accountId = req.body.transaction.accountid[0];
            let amount = parseFloat(req.body.transaction.amount[0]);

            let balancequery = 'select balance from Accounts where accountid = ?';
            let balanceResult = await dbfuns.getBalance(balancequery, [accountId]);

            let query = 'update Accounts set balance = ? where accountid = ?';

            switch (transactionType) {
                case 'withdraw':

                    let newWithdrawBalance = parseFloat(balanceResult.balance - amount);
                    newWithdrawBalance = newWithdrawBalance.toFixed(2);

                    if (newWithdrawBalance < 0) {
                        res.set('Content-Type', 'text/xml');
                        res.send('false');
                        break;
                    }
                    else {
                        
                        await dbfuns.performTransaction(query, [newWithdrawBalance, accountId]);

                        res.set('Content-Type', 'text/xml');
                        res.send('true');
                        break;
                    }
                case 'deposit':
                    let newDepositBalance = parseFloat(balanceResult.balance + amount);
                    newDepositBalance = newDepositBalance.toFixed(2);

                    await dbfuns.performTransaction(query, [newDepositBalance, accountId]);

                    res.set('Content-Type', 'text/xml');
                    res.send('true');
                    break;
                case 'transfer':
                    // TODO: Ensure tranfer account belongs to user

                    let transferAccountId = req.body.transaction.transferto[0];
                    

                    // Get transfer to account balance
                    let transferToBalance = await dbfuns.getBalance(balancequery, [transferAccountId]);
                    transferToBalance = transferToBalance.balance;
                    

                    // Create new balances for each
                    let newTranferredToBalance = parseFloat(transferToBalance + amount);
                    let newTranferredFromBalance = parseFloat(balanceResult.balance - amount);

                    newTranferredToBalance = newTranferredToBalance.toFixed(2);
                    newTranferredFromBalance = newTranferredFromBalance.toFixed(2);

                    // Check to make sure account tranferred from does not go to 0 
                    if(newTranferredFromBalance < 0) {
                        res.set('Content-Type', 'text/xml');
                        res.send('false');
                        break;
                    }
                    else {
                        // Update both accounts
                        await dbfuns.performTransaction(query, [newTranferredToBalance, transferAccountId])
                        await dbfuns.performTransaction(query, [newTranferredFromBalance, accountId]);

                        res.set('Content-Type', 'text/xml');
                        res.send('true');
                        break;
                    }
                default:
                    res.set('Content-Type', 'text/xml');
                    res.send('false');
            }
            // res.set('Content-Type', 'text/xml');
            // res.send('true');
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