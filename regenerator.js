'use strict';
var regenerator = require('regenerator');
regenerator.runtime();
BCP.mergeModules = function(modules) {
    var key;
    var source;
    for (key in modules) {
        if (modules.hasOwnProperty(key) && typeof modules[key][0] === 'function') {
            source = '(function(require,module,exports){\n' + modules[key][0]().toString() + '\n})';
            if (!source.match(/function\s*\*{1}/)) {
                source = 'return function(require,module,exports){\n' + modules[key][0]().toString() + '\n}';
                modules[key][0] = (new Function(source))();
                continue;
            }
            source = regenerator.compile(source).code;
            modules[key][0] = (new Function('return ' + source))();
        }
    }
    BCP._mergeModules.call(BCP, modules);
}
