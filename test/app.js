'use strict';
var app = module.exports = require('koa')();
app.root = __dirname;
app.use(function* (next) {
    console.log(1);
    this.type = 'html';
    this.body = require('fs').readFileSync('./index.html');
});
