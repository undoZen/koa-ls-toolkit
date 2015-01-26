'use strict';
var path = require('path');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var Promise = require('bluebird');
var Transform = require('stream').Transform
var regenerator = require('regenerator');

watchify.args.exposeAll = true;
watchify.args.prelude = 'BCP.prelude';

function exists(filePath) {
    return new Promise(function(resolve) {
        console.log(filePath);
        fs.exists(filePath, console.log.bind(console));
        fs.exists(filePath, resolve.bind(this));
    });
}

module.exports = function (gulp, app, listen) {
    function getFilePath(filePath) {
        if (filePath.indexOf(app.root) === 0) {
            return filePath;
        }
        return path.join(app.root, filePath);
    }
    function newB(reqPath) {
        var b = browserify(getFilePath(reqPath), watchify.args)
            .transform('liveify')
            /*
            .transform(function (filePath) {
                var fr = new Transform();
                console.log('fr', filePath);
                if (!filePath.match(/\.js/i)) {
                    fr._transform = function (chunk, enc, cb) {
                        cb(null, chunk);
                    };
                    return fr;
                }
                var source = '';
                fr._transform = function (chunk, enc, cb) {
                    source += chunk;
                    cb();
                };
                fr._flush = function (cb) {
                    console.log(source);
                    if (!source.match(/function\s*\*{1}/)) {
                        fr.push(source);
                        return cb();
                    }
                    var err, es5SourceWithRuntime;
                    try {
                        es5SourceWithRuntime = regenerator.compile(source, {
                            includeRuntime: true
                        }).code;
                    } catch (_err) {
                        err = _err;
                    }
                    if (!err) fr.push(es5SourceWithRuntime);
                    cb(err);
                };
                return fr;
            });
            */
        var fr = new Transform({ objectMode: true });
        fr._transform = function (row, enc, cb) {
            row.source = 'return ' + JSON.stringify(row.source);
            cb(null, row);
        };
        b.pipeline.get('pack').unshift(fr);
        return b;
    }
    gulp.task('watchify', function() {
        watchify(browserify(watchify.args)).on('update', console.log.bind(console));
    });
    gulp.task('dev', ['watchify'], function() {
        var regeneratorSource = require('fs').readFileSync(__dirname+'/test/regenerator.js');
        app.middleware.unshift(function* (next) {
            if (this.path === '/regenerator.js') {
                this.type = 'js';
                this.body = regeneratorSource;
                return;
            }
            if (!this.path.match(/\.js$/)) {
                return yield next;
            }
            var filePath = getFilePath(this.path);
            if ((yield exists(filePath)) || (
                    filePath = filePath.replace(/\.js$/i, '.ls'),
                    console.log(filePath),
                    yield exists(filePath))) {
                this.status = 200
                this.type = 'js'
                this.respond = false;
                newB(filePath).bundle().pipe(this.res);
                return;
            }
            yield next;
        });
        listen(app);
    });
}
