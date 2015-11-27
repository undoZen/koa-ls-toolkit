console.log('hello')
global.Promise = require('bluebird');
co = require('co');
#regenerator = require('regenerator')

function now()
    d = new Date!
    d.valueOf!
co ->*
    a = now!
    yield new Promise (resolve) ->
        setTimeout resolve, 1000
    debugger
    console.log now! - a
    console.log 'world'
