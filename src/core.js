/**
 * @fileoverview GMU命名空间以及帮助方法
 */

(function( env ) {

    var undefined;

    if (env.gmu) {
        return;
    }

    var gmu = env.gmu = function() {
        return gmu.fn && gmu.fn.apply(this, arguments);
    };

    gmu.debug = true;

    gmu.log = function(msg, type) {
        if (!gmu.debug) {
            return;
        }

        console.log(msg);
    };

    gmu.mixin = function(target, source) {
        for (var key in source) {

            if (source[key] !== undefined) {
                target[key] = source[key];
            }

        }
    };


    gmu.find = function(selector, context) {
        return (context || document).querySelectorAll(selector);
    }

    gmu.bind = function(fn, context) {

        if (typeof fn.bind === 'function') {
            return fn.bind(context);
        }

        return function() {
            return fn.apply(context, arguments);
        };
    }

    gmu.addEvent = function(el, event, callback) {
        return el.addEventListener(event, callback, false);
    }

    gmu.toArray = function(arrayLikeObject) {
        return Array.prototype.slice.call(arrayLikeObject);
    }


})(this);
