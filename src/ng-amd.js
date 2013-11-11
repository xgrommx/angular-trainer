/**
 * Created by igi on 10.11.13.
 */
define(function () {

    /**
     * Patch for angular amd loading
     * @param config
     * @constructor
     */
    function NgAmd() {
        /**
         * Application packages
         * @type {null}
         * @private
         */
        this._packages = null;
        /**
         * Module
         * @type {null}
         * @private
         */
        this._module = null;
        /**
         * Folder structire
         * @type {{}}
         * @private
         */
        this._folderStructure = {};
    };
    /**
     * Folder structure
     * @param ob
     */
    NgAmd.prototype.setFolderStructure = function (ob) {
        this._folderStructure = ob;
    }
    /**
     * Set application packages
     * @param definition
     */
    NgAmd.prototype.setPackages = function (definition) {
        this._packages = definition;
    };
    /**
     * Get package
     * @param name
     * @param type
     * @returns {*}
     */
    NgAmd.prototype.getPackage = function (name, type) {
        var i, len = this._packages.length, c;
        for (i = 0; i < len; ++i) {
            c = this._packages[i];
            if ((c.name === name && c.type === type) || (c.folder === name && c.type === type)) {
                return c;
            }
        }
        throw new Error('Package {name:' + name + ', type: ' + type + '} is not found');
    }

    /**
     * Setup module
     * @param module
     */
    NgAmd.prototype.setModule = function (module) {
        this._createBootstrapModule();
        this._module = module;
    }

    /**
     * Create bootstrap patch
     */
    NgAmd.prototype._createBootstrapModule = function () {
        var self = this;
        /**
         * Bootstraping module
         * @type {module}
         */
        var module = angular.module('ngAMD', []);
        /**
         * On instance allow access to registration process
         */
        module.config(function ($provide, $animateProvider, $compileProvider, $filterProvider, $controllerProvider) {
            /**
             * Register factory
             * @returns {*|factory|factory|factory|Object|factory}
             */
            self._module.factory = function () {
                return $provide.factory.apply($provide, arguments);
            };
            /**
             * Register service
             * @returns {service|*|service|service|service|Object}
             */
            self._module.service = function () {
                return $provide.service.apply($provide, arguments);
            };
            /**
             * Register value
             * @returns {value|*|value|value|value|value}
             */
            self._module.value = function () {
                return $provide.value.apply($provide, arguments);
            };
            /**
             * Register animation
             * @returns {register|*|Object|register|register|register}
             */
            self._module.animation = function () {
                return $animateProvider.register.apply($animateProvider, arguments);
            };
            /**
             * Register filter
             * @returns {register|*|Object|register|register|register}
             */
            self._module.filter = function () {
                return $filterProvider.register.apply($filterProvider, arguments);
            };
            /**
             * Register controller
             * @returns {register|*|Object|register|register|register}
             */
            self._module.controller = function () {
                return $controllerProvider.register.apply($controllerProvider, arguments);
            };
            /**
             * Register directive
             * @returns {*|directive|directive|directive|$compileProvider|directive}
             */
            self._module.directive = function () {
                return $compileProvider.directive.apply($compileProvider, arguments);
            };

        });
    };

    /**
     * Define a module
     */
    NgAmd.prototype.define = function () {
        var args = Array.prototype.slice.call(arguments, 0), name, deps, callback, data = [];

        if (args.length === 3) {
            name = args[0];
            deps = args[1];
            callback = args[2];
        } else if (args.length === 2) {
            if (typeof args[0] === "string") {
                name = args[0];
            } else {
                deps = args[0];
            }
            callback = args[1];
        } else {
            callback = args[0];
        }

        if (Array.isArray(deps)) {
            data = deps;
        } else if (typeof deps === "function") {
            callback = deps;
        } else if (typeof deps === "object") {
            this.merge(data, this.require(deps));
        }
        if (args.length === 3) {
            define(name, data, callback);
        } else if (args.length === 2) {
            if (name && callback) {
                define(name, callback);
            } else {
                define(data, callback);
            }
        } else {
            define(callback);
        }
    };
    /**
     * Require dependecy
     * @param type
     * @param ob
     */
    NgAmd.prototype.require = function (ob) {
        var data = [], self = this, p;

        for (var type in ob) {
            if (type === "require") {
                this.merge(data, ob[type]);
            } else {
                if (Array.isArray(ob[type])) {
                    ob[type].forEach(function (value) {
                        p = self.getPackage(value, type);
                        data.push(self._folderStructure[type] + '/' + p.folder + '/' + type);
                    });
                } else {
                    p = self.getPackage(ob[type], type);
                    data.push(self._folderStructure[type] + '/' + p.folder + '/' + type);
                }

            }
        }
        return data;
    }

    /**
     * Merge array
     * @param source
     * @param dest
     */
    NgAmd.prototype.merge = function (source, dest) {
        var i, len = dest.length;
        for (i = 0; i < len; ++i) {
            if (source.indexOf(dest[i]) === -1) {
                source.push(dest[i]);
            }
        }
    };

    /**
     * Extend an object
     * @param source
     * @param dest
     */
    NgAmd.prototype.extend = function (source, dest) {
        var i;
        for (i in dest) {
            if (dest.hasOwnProperty(i)) {
                source[i] = dest[i];
            }
        }
    };

    /**
     * Published api to window
     * @returns {{register: {factory: Function, service: Function, value: Function, animation: Function, filter: Function, controller: Function, directive: Function}}}
     */
    NgAmd.prototype.publishPublicApi = function (useMinify) {

        var self = this,
            haveDep = function (obj) {
                var i, c = 0;
                for (i in obj) {
                    ++c;
                }
                return c > 0 ? true : false;
            },
            keys = [
                'factory', 'service', 'value',
                'animation', 'filter', 'controller',
                'directive'
            ],
            def = {};


        ['constant', 'run', 'config'].forEach(function (key) {
            def[key] = function () {
                var args = Array.prototype.slice.call(arguments, 0);
                self._module[key].apply(self._module[key], args);
            };
        });

        return {
            /**
             * Register object
             */
            register: (function () {
                var pub = {};
                self.extend(pub, def);
                keys.forEach(function (key) {
                    pub[key] = function () {
                        var args = Array.prototype.slice.call(arguments, 0),
                            defineArgs = [],
                            p = self.getPackage(args[0], key),
                            name = args[0];
                        if (useMinify) {
                            name = args[0] + key;
                            defineArgs.push(name);
                        }
                        if (haveDep(p.require)) {
                            defineArgs.push(p.require);
                        }
                        defineArgs.push(function () {
                            self._module[key].apply(self._module[key], args);
                        });
                        self.define(defineArgs[0], defineArgs[1], defineArgs[2]);
                    };
                });
                return pub;
            }()),
            /**
             * Publish define
             */
            define: function () {
                var args = Array.prototype.slice.call(arguments, 0);
                self.define.apply(self, args);
            }
        };
    }

    return NgAmd;
});