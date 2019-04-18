const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

app.get('/', function(req, resp) {

});

app.post('/', function(req, resp) {

});

app.get('/createaccount', function(req, resp) {

});

app.post('/createaccount', function(req, resp) {

});

app.get('/account', function(req, resp) {

});

app.post('/account', function(req, resp) {

});

app.get('/withdraw', function(req, resp) {

});

app.post('/withdraw', function(req, resp) {

});

app.get('/deposit', function(req, resp) {

});

app.post('/deposit', function(req, resp) {

});

app.get('/transfer', function(req, resp) {

});

app.post('/transfer', function(req, resp) {

});

app.listen(port);