const sqlite3 = require('sqlite3').verbose();

module.exports = {
    getUser: function(query, params) {
        "use strict";
        let db = new sqlite3.Database('bank.db');

        return new Promise(function(resolve, reject){
            db.get(query, params, (err,row)=> {
                if (err) { 
                    reject(new Error(err.message));
                }
                resolve(row);
            });
            db.close();
        });
    },

    createAccountQuery: function(query) {
        let db = new sqlite3.Database('bank.db');

        db.run(query);

        db.close();
    }

    
};