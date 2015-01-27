'use strict';
exports.register = {
    bluebird: function() {
        global.Promise = require('bluebird');
        return this;
    },
    LiveScript: function() {
        require('LiveScript');
        return this;
    }
};

exports.gulp = require('./gulp.js');
