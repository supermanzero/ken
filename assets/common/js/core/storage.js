/**
 * Created by Colin on 2015/3/31.
 */
(function() {
    var ua = navigator.userAgent.toLowerCase();
    var t = ua.match(/msie ([\d.]+)/);
    var ie = t && t[1];
    var useUserData = ie ==6 || ie == 7;

    var encodeVal = function(value) {
        return encodeURIComponent(value);
    };

    var decodeVal = function(value) {
        return decodeURIComponent(value);
    };

    var isCookieEnabled = function() {
        if(window.navigator.cookieEnabled) {
            return window.navigator.cookieEnabled;
        }
        var key = 'test_cookie_enable',
            value = 'test' + Math.random(),
            result = _cookieStorage.set(key, value);
        if (!result) {
            return false;
        }
        var value2 = _cookieStorage.get(key);
        _cookieStorage.remove(key);
        return value == value2;
    };

    var _sessionStorage = {
        get : function(key) {
            return sessionStorage.getItem(key) || null;
        },

        set : function(key, value) {
            sessionStorage.setItem(key, value);
        },

        remove : function(key) {
            sessionStorage.removeItem(key);
        }
    };

    var _localStorage = {
        get : function(key) {
            return decodeVal(localStorage.getItem(key)) || null;
        },

        set : function(key, value) {
            value = encodeVal(value);
            localStorage.setItem(key, value);
        },

        remove : function(key) {
            localStorage.removeItem(key);
        }
    };

    var _userDataStorage = {
        init: function(maxage) {
            var memory = document.createElement('input');
            this.memory = memory;
            memory.style.display = "none";
            memory.style.behavior = "url('#default#userData')";
            document.body.appendChild(memory);

            if(maxage) {
                var now = +new Date();
                var expires = now + maxage * 1000;
                memory.expires = new Date(expires).toUTCString();
            }

            memory.load('UserDataStorage');
        },

        get : function (key) {
            return decodeVal(this.memory.getAttribute(key)) || null;
        },

        set : function(key, value) {
            value = encodeVal(value);
            this.memory.setAttribute(key, value);
            this.memory.save('UserDataStorage');
        },

        remove : function(key) {
            this.memory.removeAttribute(key);
            this.memory.save('_userDataStorage');
        }
    };

    var _cookieStorage = {
        init: function(maxage, path) {
            this.maxage = maxage;
            this.path = path;
        },
        set : function(key, value) {
            var cookie = key + '=' + encodeVal(value);
            if(this.maxage) cookie += '; max-age=' + this.maxage;
            if(this.path) cookie += '; path=' + this.path;
            document.cookie = cookie;
        },

        get : function(key) {
            var cookies = document.cookie;
            var reg = new RegExp('(?:^ |)(' + key + ')=([^;]+)');
            var value = cookies.match(reg);
            if(value) {
                return decodeVal(value[2]);
            }
            return null
        },

        remove : function(key) {
            this.init(0, '/');
            this.set(key, '');
        }
    };

    var _objectStorage = {
        init : function() {
            this.data = {};
        },
        set : function(key, value) {
            value = encodeVal(value);
            this.data[key] = value;
        },
        get : function (key) {
            return decodeVal(this.data[key]) || null;
        },
        remove : function(key) {
            delete this.data[key];
        }
    };

    /**
     * 本地存储
     * @param {String} type 存储类型 [local,session,cookie,page]
     * @param {Number} maxage cookie到期时间 单位秒
     * @param {String} path 路径
     * @return {Object} 具有set、get、remove方法
     */
    function Storage(type, maxage, path) {
        var storage;
        maxage = maxage || '';
        path = path || '/';
        type = type || 'local';

        switch (type) {
            case 'local' :
                try { // 禁用cookie、localStorage时访问会报错
                    storage = window.localStorage ? _localStorage : useUserData ? _userDataStorage : Object;
                } catch (e) {
                    storage = _objectStorage;
                }
                break;
            case 'session' :
                try { // 禁用cookie、_localStorage时访问会报错
                    storage = window.sessionStorage ? _sessionStorage : _objectStorage;
                } catch (e) {
                    storage = _objectStorage;
                }
                break;
            case 'cookie' :
                storage = isCookieEnabled() ? _cookieStorage : _objectStorage;
                break;
            case 'page' :
                storage = _objectStorage;
        }
        storage.init && storage.init(maxage, path);
        return storage;
    }

    window.Storage = Storage;
})();