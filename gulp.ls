'use strict';
require! path
require! fs
require! browserify
require! watchify
require! regenerator
require! co
Promise = require('bluebird')
Transform = require('stream').Transform

watchify.args.exposeAll = true;
watchify.args.prelude = 'BCP.prelude';

function exists(filePath)
    new Promise(fs.exists(filePath, _))

function firstExists(...files)
    return co ->*
        while files.length
            filePath = files.shift!
            if yield exists(filePath)
                return filePath
        return false

module.exports = (gulp, app, listen) ->
    function getFilePath(filePath)
        if filePath.indexOf(app.root) is 0
            return filePath
        return path.join(app.root, filePath)

    function newB(reqPath)
        b = browserify(getFilePath(reqPath), watchify.args)
            .transform('liveify')

        fr = new Transform do
            objectMode: true

        fr._transform = (row, enc, cb) ->
            row.source = 'return ' + JSON.stringify(row.source);
            cb(null, row)

        b.pipeline.get('pack').unshift(fr)
        return b

    gulp.task 'watchify', ->
        watchify(browserify(watchify.args)).on 'update', console.log.bind(console)

    gulp.task 'dev', ['watchify'], ->
        regeneratorSource = require('fs').readFileSync(__dirname + '/test/regenerator.min.js');
        app.middleware.unshift (next) ->*
            if @path.match(/\.js$/) and (filePath = yield firstExists(
                getFilePath(@path),
                getFilePath(@path).replace(/\.js$/i, '.ls')
            ))
                @status = 200
                @type = 'js'
                @respond = false;
                newB(filePath).bundle().pipe(@res)
            else
                yield next

        listen(app)
