#!/usr/bin/env node

// using ./task.js, the new javascript task runner automation framework
// https://gist.github.com/substack/8313379

var fs = require('fs');
var UglifyJS = require('uglify-js');
var indexSrc = fs.readFileSync('./test/index.src.html', 'utf-8');
var checker = fs.readFileSync('./regenerator-check.js', 'utf-8');
var bcp = fs.readFileSync(require.resolve(
    'browserify-common-prelude/dist/bcp.min.js'), 'utf-8');
var ls = require('LiveScript')
var browserify = require('browserify')

try {
    fs.mkdirSync('./test');
    fs.mkdirSync('./dist');
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

console.log('bundling regenerator.js...');
browserify('./regenerator.js', {
        basedir: __dirname,
        exposeAll: true
    })
    .bundle(function (err, browserified) {
        browserified = browserified.toString('utf-8');
        console.log('minifying regenerator.js...');
        var min = UglifyJS.minify(browserified, {
            mangle: {
                except: ['GeneratorFunction', 'require']
            },
            fromString: true
        }).code;
        fs.writeFileSync('./test/regenerator.js', browserified, 'utf-8');
        fs.writeFileSync('./test/regenerator.min.js', min, 'utf-8');
        fs.writeFileSync('./dist/regenerator.js', browserified, 'utf-8');
        fs.writeFileSync('./dist/regenerator.min.js', min, 'utf-8');
    });
