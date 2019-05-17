DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Accounts;

CREATE TABLE Users (
    userid INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT NOT NULL UNIQUE,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    address TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE `Accounts` ( 
    `accountid` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
    `users_userid` INTEGER NOT NULL, 
    `balance` REAL NOT NULL
);

INSERT INTO Users (username, password, firstname, lastname, address) VALUES ('admin', 'test', 'cameron', 'test', '123 test');
INSERT INTO Accounts (users_userid, balance) VALUES (1, 10.99);