#!/usr/bin/env node

// using ./task.js, the new javascript task runner automation framework
// https://gist.github.com/substack/8313379

var fs = require('fs');
var UglifyJS = require('uglify-js');
var dir = process.argv[2] === 'test' ? './test' : './dist';
var indexSrc = fs.readFileSync('./test/index.src.html', 'utf-8');
var checker = fs.readFileSync('./regenerator-check.js', 'utf-8');
var bcp = fs.readFileSync(require.resolve(
    'browserify-common-prelude/dist/bcp.min.js'), 'utf-8');
var ls = require('LiveScript')

try {
    fs.mkdirSync(dir);
} catch (e) {}
var min = UglifyJS.minify(checker, {
    output: {
        beautify: false,
        inline_script: true
    },
    fromString: true
}).code;
var index = indexSrc.replace('(function BCP(){})', bcp).replace("'{{RC}}'", min);
fs.writeFileSync('./test/index.html', index, 'utf-8');

fs.writeFileSync('./gulp.js', ls.compile(fs.readFileSync('./gulp.ls', 'utf-8'), {
    bare: true,
    header: false
}), 'utf-8');
