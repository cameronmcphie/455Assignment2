DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Accounts;

CREATE TABLE Users (
    userid INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT NOT NULL UNIQUE, 
    password TEXT NOT NULL
);

CREATE TABLE `Accounts` ( 
    `accountid` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
    `users_userid` INTEGER NOT NULL, 
    `balance` REAL NOT NULL
);

INSERT INTO Users (username, password) VALUES ('admin', 'test');
INSERT INTO Accounts (users_userid, balance) VALUES (1, 10.99);