BCP._mergeModules = BCP.mergeModules;
BCP.mergeModules = function(modules) {
    var key;
    var source;
    for (key in modules) {
        if (modules.hasOwnProperty(key) && typeof modules[key][0] === 'function') {
            source = 'return function(require,module,exports){\n' + modules[key][0]().toString() + '}\n';
            modules[key][0] = (new Function(source))();
        }
    }
    BCP._mergeModules.call(BCP, modules);
}
if (!('{{supportGenerator}}')) {
    document.write('<script src="/regenerator.js"><'+'/script>');
}
