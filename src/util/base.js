/**
 * Created by gsx on 15/12/24.
 */
define(function (require) {
    'use strict';

    var base = {};

    /**
     * 实现类的原型链继承
     *
     * @author gsx
     * @date 2015.4.21
     * */
    base.inherits = function (child, parent) {
        function Parent() {
        }

        Parent.prototype = parent.prototype;
        child.prototype = new Parent;
    };

    base.getUid = (function () {
        var uid = 0;
        var magic = '__GSX__';

        return function (obj, isReset) {
            return (!isReset && obj[magic]) || (obj[magic] = ++uid);
        };
    })();


    base.isString = function (o) {
        return '[object String]' == Object.prototype.toString.call(o);
    };
    base.isNumber = function (o) {
        return '[object Number]' == Object.prototype.toString.call(o) && isFinite(o);
    };
    base.isBoolean = function (o) {
        return '[object Boolean]' == Object.prototype.toString.call(o);
    };
    base.isUndefined = function (o) {
        return typeof o === 'undefined';
    };
    base.isNull = function (o) {
        return o === null;
    };
    base.isFunction = function (o) {
        return $.isFunction(o);
    };
    base.isObject = function (o) {
        return Object.prototype.toString.apply(o) === '[object Object]';
    };
    base.isArray = function (o) {
        return '[object Array]' == Object.prototype.toString.call(o);
    };
    base.isDom = (function () {
        if (base.isObject(window.HTMLElement)) {
            return function (o) {
                return o instanceof HTMLElement;
            }
        } else {
            return function (o) {
                return o &&
                    1 === o.nodeType &&
                    base.isString(o.nodeName);
            };
        }
    })();
    base.isZepto = function (o) {
        return window.$ && $.zepto && $.zepto.isZ(o);
    };
    /**
     * 多个函数调用统一参数
     */
    base.union = function () {
        var args = arguments, len = args.length;
        return function () {
            for (var i = 0; i < len; ++i) {
                if (args[i].apply(this, arguments)) {
                    return true;
                }
            }
            return false;
        };
    };
    function extend(target, source) {
        if (!source) {
            return target;
        }
        Object.keys(source).forEach(function (key) {
            if ((exports.isObject(source[key]) || Array.isArray(source[key]))) {
                if (exports.isObject(source[key]) && !exports.isObject(target[key])) {
                    target[key] = {};
                }
                if (Array.isArray(source[key]) && !Array.isArray(target[key])) {
                    target[key] = [];
                }
                extend(target[key], source[key]);
            } else if (source[key] !== undefined) {
                target[key] = source[key];
            }
        });
    }
    
    /**
     * 继承，模拟$.extend深度拷贝，替代Object.assign，后者浅拷贝
     */
    base.extend = function (target) {
        var args = [].slice.call(arguments, 1);
        
        args.forEach(function (arg) {
            extend(target, arg);
        });
        return target;
    };

    /**
     * 判断页面是否缩放，如缩放，并且window.devicePixelRatio大于等于2，宽度乘以2
     * */
    base.isScale = function () {
        var flag = false;
        var domEle = document.querySelector('meta[name=viewport]');
        var viewPortContent = domEle.getAttribute('content');
        var viewPortArr = viewPortContent.split(', ');
        var obj = {};
        
        viewPortArr.forEach(function (value) {
            var tempArr = value.split('=');
            obj[tempArr[0]] = tempArr[1];
        });

        if (obj['initial-scale'] < 1) {
            flag = true;
        }

        return flag;
    };

    /**
     * 像素转rem
     *
     * @param {number} numPx 像素数
     * @param {boolean} [isBasePixel] 是否是UE图上取出的像素值
     * */
    base.px2rem = function (numPx, isBasePixel) {
        if (window.rem) {
            //var width = document.documentElement.getBoundingClientRect().width;
            //return numPx / width * 20 + 'rem';
            var rst = numPx / window.rem;
            if (isBasePixel) {
                rst *= window.rem / 16;
            }
            return rst + 'rem';
        } else {
            return numPx / 16 + 'rem';
        }
    };

    return base;

});