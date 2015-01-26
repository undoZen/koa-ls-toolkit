require! \./app
require! gulp
require('../').gulp gulp, app, (app) ->
    app.listen 8888, '0.0.0.0' ->
        console.log @address!
