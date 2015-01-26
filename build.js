#!/usr/bin/env node

// using ./task.js, the new javascript task runner automation framework
// https://gist.github.com/substack/8313379

var fs = require('fs');
var UglifyJS = require('uglify-js');
var dir = process.argv[2] === 'test' ? './test' : './dist';

try {
    fs.mkdirSync(dir);
} catch (e) {}
var gd = require('generator-detector').toString();
console.log(gd);
var checker = fs.readFileSync('./regenerator-check.js', 'utf-8').replace("'{{supportGenerator}}'", gd+'()');
console.log(checker);
var min = UglifyJS.minify(checker, {fromString: true}).code;
min = min.replace(/<\/script>/g, "<'+'/script>");
/*
if (min[0] === '!') {
    min = '(' + min.substring(1) + ')'
}
*/
fs.writeFileSync(dir+'/regenerator-check.js', checker, 'utf-8');
fs.writeFileSync(dir+'/regenerator-check.min.js', min, 'utf-8');
