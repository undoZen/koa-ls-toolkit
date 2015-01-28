BCP._mergeModules = BCP.mergeModules;
if (!(function () {
        try {
            eval('var gen = function *(){}');
            return gen.constructor.name === 'GeneratorFunction';
        } catch (e) {
            return false;
        }
    }())) {
    (function () {
        var queue = [];
        BCP.mergeModules = function () {
            var args = Array.prototype.slice.call(arguments);
            queue.push(args);
        };
        BCP._ready = BCP.ready;
        BCP.ready = function () {
            BCP._loaded = true;
        };
        BCP.regeneratorReady = function (cb) {
            cb(queue);
        };
    }());
    document.write(
        '<script src="http://wuyongzhiyong.b0.upaiyun.com/js/regenerator-patch.min.js" async><' +
        '/script>');
} else {
    BCP.mergeModules = function (modules) {
        var key;
        var source;
        for (key in modules) {
            if (modules.hasOwnProperty(key) &&
                typeof modules[key][0] === 'function') {
                source = 'return function(require,module,exports){\n' +
                    modules[key][0]().toString() + '}\n';
                modules[key][0] = (new Function(source))();
            }
        }
        BCP._mergeModules.call(BCP, modules);
    };
}
