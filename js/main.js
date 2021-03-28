var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) {
                descriptor.writable = true;
            }
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) {
            defineProperties(Constructor.prototype, protoProps);
        }
        if (staticProps) {
            defineProperties(Constructor, staticProps);
        }
        return Constructor;
    };
}();

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    }
    else {
        return Array.from(arr);
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/*jshint esversion: 6 */

var CookieManagerRenderer = function () {
    _createClass(CookieManagerRenderer, [{
        key: 'setUpListeners',
        value: function setUpListeners() {
            var _this = this;

            window.addEventListener("click", function (event) {

                var target = event.target;

                if (typeof target.dataset.vkCookieManagerOpenBanner !== 'undefined' || typeof target.dataset.vk_cookie_manager_open_banner !== 'undefined') {
                    event.preventDefault();
                    _this.showBanner();
                    return false;
                }

                if (typeof target.dataset.vkCookieManagerOpenModal !== 'undefined' || typeof target.dataset.vk_cookie_manager_open_modal !== 'undefined') {
                    event.preventDefault();
                    _this.showModal();
                    return false;
                }

                if (typeof target.dataset.vkCookieManagerCloseModal !== 'undefined') {
                    _this.hideModal();
                }

                if (typeof target.dataset.vkCookieManagerEnableAll !== 'undefined') {
                    _this.hideBanner();
                    _this.cookieManager.unblockAll();
                }

                if (typeof target.dataset.vkCookieManagerToggleGroup !== 'undefined') {
                    var group = target.getAttribute('data-group');
                    var toggle_value = document.querySelectorAll('input[data-group=' + group + ']')[0].checked;

                    if (group && group.length) {
                        [].concat(_toConsumableArray(document.querySelectorAll('.vk_cookie_manager__modal input[data-group=' + group + ']'))).map(function (item) {
                            item.checked = !toggle_value;

                            var event = document.createEvent('HTMLEvents');
                            event.initEvent("change", true, true);
                            item.dispatchEvent(event);
                        });
                    }
                }

                if (typeof target.dataset.vkCookieManagerEnableAll !== 'undefined') {
                    [].concat(_toConsumableArray(document.querySelectorAll('.vk_cookie_manager__modal input[type=checkbox]'))).map(function (item) {
                        item.checked = 1;

                        var event = document.createEvent('HTMLEvents');
                        event.initEvent("change", true, true);
                        item.dispatchEvent(event);
                    });
                }

                if (typeof target.dataset.vkCookieManagerDisableAll !== 'undefined') {
                    [].concat(_toConsumableArray(document.querySelectorAll('.vk_cookie_manager__modal input[type=checkbox]'))).map(function (item) {
                        item.checked = 0;

                        var event = document.createEvent('HTMLEvents');
                        event.initEvent("change", true, true);
                        item.dispatchEvent(event);
                    });
                }
            });

            window.addEventListener("change", function (event) {
                var target = event.target;
                var name = target.getAttribute('name');
                if (name && name.length && name.indexOf('service__input--') === 0) {
                    var service = target.getAttribute('data-service');

                    if (service && service.length) {
                        _this.cookieManager.toggleScript(service, target.checked);
                    }
                }
            });

            window.addEventListener("load", function () {
                _this.cookieManager.openBannerIfNeeded();
            });
        }
    }]);

    function CookieManagerRenderer(config, CookieManager) {
        _classCallCheck(this, CookieManagerRenderer);

        this.interface = config.interface;
        this.groups = config.groups;
        this.templates = config.templates;
        this.cookieManager = CookieManager;

        this.setUpListeners();
    }

    _createClass(CookieManagerRenderer, [{
        key: 'showBanner',
        value: function showBanner() {

            var body = document.body;
            var bodyClasses = body.classList;

            if (!bodyClasses.contains('js-vk_cookie_manager--banner-visible')) {
                bodyClasses.add('js-vk_cookie_manager--banner-visible');
                var html = this.templates.banner(this.interface.banner);
                var node = document.createElement('div');
                node.setAttribute('id', 'vk_cookie_manager--banner');
                node.innerHTML = html;
                body.appendChild(node);
            }
        }
    }, {
        key: 'hideBanner',
        value: function hideBanner() {
            document.body.classList.remove('js-vk_cookie_manager--banner-visible');
            var banner = document.getElementById('vk_cookie_manager--banner');
            if (banner) {
                banner.parentNode.removeChild(banner);
            }
        }
    }, {
        key: 'showModal',
        value: function showModal() {
            var _this2 = this;

            var body = document.body;
            var bodyClasses = body.classList;

            this.hideBanner();

            if (!bodyClasses.contains('js-vk_cookie_manager--modal-visible')) {
                bodyClasses.add('js-vk_cookie_manager--modal-visible');
                var html = this.templates.modal(this.interface.modal, this.groups);
                var node = document.createElement('div');
                node.setAttribute('id', 'vk_cookie_manager--modal');
                node.innerHTML = html;
                body.appendChild(node);

                [].concat(_toConsumableArray(document.querySelectorAll('.vk_cookie_manager__modal input[data-service]'))).map(function (item) {
                    item.checked = _this2.cookieManager.isAllowed(item.getAttribute('data-service'));
                });
            }
        }
    }, {
        key: 'hideModal',
        value: function hideModal() {

            for (let groupid in this.cookieManager.config.groups) {

                if (this.cookieManager.config.groups.hasOwnProperty(groupid)) {

                    for (let serviceid in this.cookieManager.config.groups[groupid].services) {

                        if (this.cookieManager.config.groups[groupid].services.hasOwnProperty(serviceid)) {

                            let service = this.cookieManager.config.groups[groupid].services[serviceid];
                            let target = document.getElementById('service__input--' + service.machine_name);

                            if (target && !service.disabled && service.default_allowed) {

                                this.cookieManager.toggleScript(service, target.checked);
                                this.cookieManager.updateUserPreferences();
                            }
                        }
                    }
                }
            }

            this.cookieManager.setUserHasSetUpPreferences(true);
            document.body.classList.remove('js-vk_cookie_manager--modal-visible');
            var modal = document.getElementById('vk_cookie_manager--modal');
            if (modal) {
                modal.parentNode.removeChild(modal);
            }
        }
    }]);

    return CookieManagerRenderer;
}();

var CookieManager = function () {
    function CookieManager(config) {
        _classCallCheck(this, CookieManager);

        this.patternsByService = [];
        this.allowedServices = [];

        this.config = window.deepmerge(window.vk_cookie_manager.default_config, config) || window.vk_cookie_manager.default_config;
        this.yett = window.yett;
        this.readUserPreferences();
        this.initServices();
        this.renderer = new CookieManagerRenderer(this.config, this);
    }

    _createClass(CookieManager, [{
        key: 'initServices',
        value: function initServices() {

            for (var groupid in this.config.groups) {

                if (this.config.groups.hasOwnProperty(groupid)) {

                    if (this.config.groups[groupid].disabled) {
                        delete this.config.groups[groupid];
                    }
                    else {

                        for (var serviceid in this.config.groups[groupid].services) {

                            if (this.config.groups[groupid].services.hasOwnProperty(serviceid)) {

                                if (this.config.groups[groupid].services[serviceid].disabled) {

                                    delete this.config.groups[groupid].services[serviceid];
                                }
                                else {

                                    var service = this.config.groups[groupid].services[serviceid];

                                    if (service.pattern instanceof Array) {
                                        this.patternsByService[service.machine_name] = service.pattern;
                                    }
                                    else {
                                        this.patternsByService[service.machine_name] = [service.pattern];
                                    }

                                    if (this.isAllowed(service.machine_name) || (service.default_allowed && !this.userHasSetUpPreferences())) {
                                        this.unblockScript(service.machine_name, false);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: 'toggleScript',
        value: function toggleScript(machine_name, bool) {
            if (bool) {
                this.unblockScript(machine_name);
            }
            else {
                this.blockScript(machine_name);
            }
        }
    }, {
        key: 'blockScript',
        value: function blockScript(machine_name) {
            if (machine_name in this.patternsByService) {

                var index = this.allowedServices.indexOf(machine_name);

                if (index !== -1) {
                    this.allowedServices.splice(index, 1);
                }

                this.updateUserPreferences();
            }
        }
    }, {
        key: 'unblockAll',
        value: function unblockAll() {

            var keys = Object.keys(this.patternsByService);
            for (var index in keys) {
                if (keys.hasOwnProperty(index)) {
                    this.unblockScript(keys[index], false);
                }
            }
            this.setUserHasSetUpPreferences(true);
            this.updateUserPreferences();
        }
    }, {
        key: 'unblockScript',
        value: function unblockScript(machine_name) {
            var _this3 = this;

            var save = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (machine_name in this.patternsByService) {

                this.patternsByService[machine_name].forEach(function (pattern) {
                    _this3.yett.unblock(pattern.split('/').join('').split('\\').join(''));
                });

                var index = this.allowedServices.indexOf(machine_name);

                if (index === -1) {
                    this.allowedServices.push(machine_name);
                }

                if (save) {
                    this.updateUserPreferences();
                }
            }
        }
    }, {
        key: 'isBlocked',
        value: function isBlocked(machine_name) {

            return this.allowedServices.indexOf(machine_name) === -1;
        }
    }, {
        key: 'isAllowed',
        value: function isAllowed(machine_name) {

            return !this.isBlocked(machine_name);
        }
    }, {
        key: 'readCookie',
        value: function readCookie(name) {

            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }

            return '';
        }
    }, {
        key: 'userHasSetUpPreferences',
        value: function userHasSetUpPreferences() {

            return this.readCookie('vk_cookie_manager_is_setup') === '1';
        }
    }, {
        key: 'setUserHasSetUpPreferences',
        value: function setUserHasSetUpPreferences(bool) {

            var value = bool ? '1' : '0';
            var date = new Date();
            date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
            var expires = date.toUTCString();

            document.cookie = 'vk_cookie_manager_is_setup=' + value + '; expires=' + expires + '; path=/';
        }
    }, {
        key: 'readUserPreferences',
        value: function readUserPreferences() {

            var cookieValue = this.readCookie("vk_cookie_manager_allowed_scripts");

            if (cookieValue.length) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {

                    for (var _iterator = cookieValue.split('|')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var value = _step.value;

                        this.allowedServices.push(value);
                    }
                }
                catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                }
                finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    }
                    finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }
    }, {
        key: 'updateUserPreferences',
        value: function updateUserPreferences() {

            var value = this.allowedServices.join('|');

            var date = new Date();
            date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
            var expires = date.toUTCString();

            document.cookie = 'vk_cookie_manager_allowed_scripts=' + value + '; expires=' + expires + '; path=/';
        }
    }, {
        key: 'openBannerIfNeeded',
        value: function openBannerIfNeeded() {

            if (!this.userHasSetUpPreferences()) {
                this.renderer.showBanner();
            }
        }
    }]);

    return CookieManager;
}();

window.CookieManager = new CookieManager(window.vk_cookie_manager_settings || {});