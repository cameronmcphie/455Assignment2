const sqlite3 = require('sqlite3').verbose();

module.exports = {

    performTransaction: function(query, params) {
        "use strict";
        let db = new sqlite3.Database('bank.db');
        return new Promise(function(resolve, reject){
            db.run(query, params, function(err) {
                if (err) { 
                    reject(new Error(err.message));
                }
                else {
                    resolve(true);
                }
            });
            db.close();
        });
    },

    getBalance: function(query, params) {
        "use strict";
        let db = new sqlite3.Database('bank.db');

        return new Promise(function(resolve, reject){
            db.get(query, params, (err,row)=> {
                if (err) { 
                    reject(new Error(err.message));
                }
                else {
                    resolve(row);
                }
            });
            db.close();
        });
    },

    getUser: function(query, params) {
        "use strict";
        let db = new sqlite3.Database('bank.db');

        return new Promise(function(resolve, reject){
            db.get(query, params, (err,row)=> {
                if (err) { 
                    reject(new Error(err.message));
                }
                else {
                    resolve(row);
                }
            });
            db.close();
        });
    },

    createAccountQuery: function(query, params) {
        let db = new sqlite3.Database('bank.db');

        db.run(query, params, function(err) {
            console.log(err);
        });

        db.close();
    }

    
};