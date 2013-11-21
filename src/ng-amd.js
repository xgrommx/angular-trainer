/**
 * Created by igi on 10.11.13.
 */
define('ng-amd', function () {

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
         * Definitions
         * @type {Array}
         * @private
         */
        this._definitions = [];
        /**
         * Base url
         * @type {null}
         * @private
         */
        this._base = '';
        /**
         * External dependencys loaded and pushed to _libs so that can be accessable to censhare api
         * @type {{}}
         * @private
         */
        this._libs = {};
    };

    /**
     * Baseurl
     * @param base
     */
    NgAmd.prototype.setBaseUrl = function (base) {
        this._base = base;
    }
    /**
     * Set application packages
     * @param definition
     */
    NgAmd.prototype.setPackages = function (definition) {
        this._packages = definition;
    };
    /**
     * Return type
     * @param type
     * @returns {*}
     */
    NgAmd.prototype.getType = function (type) {
        switch (type) {
            case 'providers':
                return 'provider';
                break;
            case 'controllers':
                return 'controller';
                break;
            case 'directives':
                return 'directive';
                break;
            case 'values':
                return 'value';
                break;
            case 'services':
                return 'service';
                break;
            case 'factories':
                return 'factory';
                break;
            case 'filters':
                return 'filter';
                break;

        }
        return type;
    }
    /**
     * Get package
     * @param name
     * @param type
     * @returns {*}
     */
    NgAmd.prototype.getPackage = function (name, type) {
        type = this.getType(type);
        var i, len = this._packages.length, c;
        for (i = 0; i < len; ++i) {
            c = this._packages[i];
            if ((c.name === name && c.type === type)) {
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
    NgAmd.prototype.defineModule = function () {

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
            this._definitions.push({
                name: name,
                data: data,
                callback: callback
            });
            define(name, data, callback);
        } else if (args.length === 2) {
            if (name && callback) {
                this._definitions.push({
                    name: name,
                    callback: callback
                });
                define(name, callback);
            } else {
                this._definitions.push({
                    data: data,
                    callback: callback
                });
                define(data, callback);
            }
        } else {
            this._definitions.push({
                callback: callback
            });
            define(callback);
        }
    };

    /**
     * Check package
     */
    NgAmd.prototype.checkPackage = function (name) {
        var i, len = this._packages.length, c;
        for (i = 0; i < len; ++i) {
            c = this._definitions[i];

            if (c && c.name && (c.name === name)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Require dependecy
     * @param type
     * @param ob
     */
    NgAmd.prototype.require = function (ob) {
        var data = [], self = this, p;

        if (ob && ob.require) {
            this.merge(data, ob.require);
        }

        for (var type in ob) {
            if (type !== "require") {
                var typ = self.getType(type);
                if (Array.isArray(ob[type])) {
                    ob[type].forEach(function (value) {
                        p = self.getPackage(value, typ);
                        data.push(p.folder + typ);
                    });
                } else {
                    p = self.getPackage(ob[type], typ);
                    data.push(p.folder + typ);
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
                'directive', 'provider'
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
                            name,
                            typ = self.getType(key);
                        if (useMinify) {
                            name = p.folder + typ;
                            defineArgs.push(name);
                        }
                        if (haveDep(p.dependency)) {
                            defineArgs.push(p.dependency);
                        }

                        defineArgs.push(function () {
                            if (p.dependency && p.dependency.require) {
                                if (Array.isArray(p.dependency.require)) {

                                    var depArgs = Array.prototype.slice.call(arguments, 0);
                                    p.dependency.require.forEach(function (value, index) {
                                        if (depArgs[index]) {
                                            self._libs[value] = depArgs[index];
                                        } else {
                                            if (value in window) {
                                                self._libs[value] = window[value];
                                            }
                                        }
                                    });
                                }
                            }
                            self._module[key].apply(self._module[key], args);
                            return null;
                        });
                        self.defineModule.apply(self, defineArgs);
                    };
                });


                return pub;
            }()),
            /**
             * Require function
             */
            require: (function () {
                var ob = {};
                keys.forEach(function (value) {
                    ob[value] = function (v) {
                        var o = {}, r;
                        o[value] = v;
                        r = self.require(o);
                        if (Array.isArray(v)) {
                            return r;
                        }
                        return r.pop();
                    }
                });
                return ob;
            }()),
            /**
             *
             * @param data
             * @param callback
             */
            requirejs: function (deps, callback) {
                var data = [], items = self.require(deps);
                if (typeof items === "string") {
                    data.push(items);
                } else {
                    self.merge(data, items);
                }
                requirejs(data, function () {
                    if (deps && deps.require) {
                        if (Array.isArray(deps.require)) {
                            var depArgs = Array.prototype.slice.call(arguments, 0);
                            deps.require.forEach(function (value, index) {
                                if (depArgs[index]) {
                                    self._libs[value] = depArgs[index];
                                } else {
                                    if (value in window) {
                                        self._libs[value] = window[value];
                                    }
                                }
                            });
                        }
                    }
                    callback.apply(requirejs, depArgs);
                });
            },
            /**
             * Return path path
             */
            getPath: function (name, type) {
                var p = self.getPackage(name, type);
                return self._base + p.folder;
            },
            /**
             * Return packages
             */
            getPackages: function () {
                return self._packages;
            },
            /**
             * Reference to self define
             */
            define: function () {
                var depArgs = Array.prototype.slice.call(arguments, 0);
                self.defineModule.apply(self, depArgs);
            },
            /**
             * Get an library from package
             * @param name
             * @returns {*}
             */
            get: function (name) {
                return  self._libs[name] !== undefined ? self._libs[name] : null;
            },
            /**
             * Templates
             */
            template: function (name, type) {
                var p = self.getPackage(name, type);
                return  self._base + p.folder + 'template.html';
            }
        };
    }

    return NgAmd;
});