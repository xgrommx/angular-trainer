/**
 * Created by igi on 16.11.13.
 */
angularTrainer.register.directive(
    'atNavBrand',
    [
        function () {
            return {
                restrict: 'E',
                templateUrl: angularTrainer.template('atNavBrand', 'directive'),
                link: function (scope) {
                    scope.brand = {
                        img: 'http://angularjs.org/img/AngularJS-small.png',
                        href: 'http://angularjs.org/',
                        collapse: '#nav-left-collapse'
                    };
                }
            }
        }
    ]
);