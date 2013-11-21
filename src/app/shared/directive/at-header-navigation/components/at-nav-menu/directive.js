/**
 * Created by igi on 16.11.13.
 */
angularTrainer.register.directive(
    'atNavMenu',
    ['$templateCache', 'atMenu',
        function ($templateCache, atMenu) {
            var templateKey = angularTrainer.template('atNavMenu', 'directive');
            return {
                restrict: 'E',
                templateUrl: templateKey,
                replace: true,
                scope: {}, // isolate scope
                controller: function () {
                    /**
                     * Return template from cache
                     * @returns {*}
                     */
                    this.getTemplate = function () {
                        var xhrResponse = $templateCache.get(templateKey);
                        if (Array.isArray(xhrResponse)) {
                            return xhrResponse[1];
                        }
                        return null;
                    }
                },
                link: function (scope, element, attr) {

                    scope.menu = atMenu.get(attr.menu);

                    if (angular.isDefined(attr.cssClass)) {
                        scope.cssClass = attr.cssClass;
                    } else {
                        scope.cssClass = angular.isDefined(attr.isRtl) ? 'nav navbar-nav navbar-right' : 'nav navbar-nav';
                    }


                }
            }
        }
    ]
);