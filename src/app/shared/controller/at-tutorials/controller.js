/**
 * Created by igi on 17.11.13.
 */
angularTrainer.register.controller(
    'atTutorials',
    ['$scope', 'atMenu', '$routeParams',
        function ($scope, atMenu, $routeParams) {

            /**
             * Page title
             * @type {string}
             */
            $scope.pageTitle = 'Structuring an AngularJs application';

            /**
             * Getting controller from packages
             * @param name
             * @returns {*}
             */
            function getController(name) {
                var packages = angularTrainer.getPackages();
                var filterd = packages.filter(function (value) {
                    return value.menu && value.menu.href === '/tutorials/' + name;
                }).pop();

                if (filterd && filterd.name) {
                    return filterd.name;
                }
                return null;
            }
            /**
             * Fetch
             * @type {*}
             */
            $scope.controllerName = getController($routeParams.name);
        }
    ]
)