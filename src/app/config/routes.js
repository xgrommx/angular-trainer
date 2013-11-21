define(function () {
    /**
     * Route builder
     * @param data
     * @constructor
     */
    function RouteBuilder(data) {
        this.routes = [];
        this.compile(data);
    }

    /**
     * Route builder
     * @type {{getRoutes: Function, fetchController: Function, buildRoute: Function, compile: Function}}
     */
    RouteBuilder.prototype = {
        /**
         * Return routes
         * @returns {Array}
         */
        getRoutes: function () {
            return this.routes;
        },
        /**
         * Fetch controller
         */
        fetchController: function (name, dependency) {
            return ['$q',
                function ($q) {
                    var d = $q.defer();
                    angularTrainer.requirejs(angular.extend({
                        controller: name
                    }, dependency), function () {
                        d.resolve('Controller ' + name + ' loaded');
                    });
                    return d.promise;
                }
            ];
        },
        /**
         * Build route
         */
        buildRoute: function (value) {
            var route = {
                route: value.route,
                options: {
                    resolve: {}
                }
            }, item;
            for (item in value.options) {
                switch (item) {
                    case 'controller':
                        route.options.controller = value.options[item];
                        route.options.resolve.controller = this.fetchController(route.options.controller);
                        if (!('template' in value.options || 'templateUrl' in value.options)) {
                            route.options.templateUrl = angularTrainer.template(route.options.controller, 'controller');
                        }
                        break;
                    default:
                        route.options[item] = value.options[item];
                        break;
                }
            }

            this.routes.push(route);
        },
        /**
         * Compile routes
         * @param data
         */
        compile: function (data) {
            var self = this;
            data.forEach(function (value) {
                self.buildRoute(value);
            });
        }
    };


    var data = [], routes;

    var menuPackages = angularTrainer.getPackages().filter(function (value) {
        return angular.isDefined(value.routes) && angular.isArray(value.routes);
    });
    /**
     * Dynamicly add controllers from package if have an menu object
     */
    menuPackages.forEach(function (value) {
        value.routes.forEach(function (route) {
            data.push(route);
        });
    });


    /**
     * Compile routes
     * @type {Array}
     */
    routes = new RouteBuilder(data).getRoutes();

    return routes;
});