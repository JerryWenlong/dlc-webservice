var http=require('https');
var fs=require('fs');
var url=require('url');
var express=require('express');
var app=express();
var path = require('path');

var routes=require('./routes')(app,http);

var ejs=require('ejs');

app.use(express.static(path.join(__dirname, 'views')));

app.set('views', __dirname + '/views');

app.engine('.html',ejs.__express);

app.set("view engine","html");

app.listen(8081);


