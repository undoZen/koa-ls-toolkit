'use strict';
exports.register = {
    bluebird: function () {
        global.Promise = require('bluebird');
    },
    LiveScript: function () {
        require('LiveScript');
    }
};
