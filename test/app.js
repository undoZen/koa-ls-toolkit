'use strict';
var app = module.exports = require('koa')();
app.root = __dirname;
app.use(function* (next) {
    this.type = 'html';
    this.body = require('fs').readFileSync('./index.html');
});
