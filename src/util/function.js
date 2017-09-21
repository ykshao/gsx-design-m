/**
 * Created by gsx on 15/12/24.
 * 函数的扩展操作
 */
define(function (require) {
    'use strict';

    var utilArray = require('util/array');

    var fun = {};

    
    fun.singleton = function (cons, options) {
        if (!cons.hasOwnProperty('__instance__')) {
            cons.__instance__ = new cons(options);
        }
        return cons.__instance__;
    };

    fun.bind = function (handle, context) {
        var args = utilArray.argsToArray(arguments, 2);
        return function () {
            return handle.apply(context, args.concat(utilArray.argsToArray(arguments)));
        };
    };

    fun.lazyConst = function (f) {
        var c;
        return function () {
            if (f) {
                c = f();
                f = null;
            }
            return c;
        };
    };

    fun.nothing = function () {};

    fun.counter = function (n, fn) {
        if (!n) {
            fn();
        } else {
            return function () {
                --n || fn();
            };
        }
    };

    return fun;
});