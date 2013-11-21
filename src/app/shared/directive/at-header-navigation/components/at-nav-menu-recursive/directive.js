/**
 * Created by igi on 16.11.13.
 */
angularTrainer.register.directive(
    'atNavMenuRecursive',
    [   '$compile',
        function ($compile) {

            return {
                restrict: 'E',
                require: '^atNavMenu',
                terminal: true,
                link: function (scope, element, attr, atNavMenu) {

                    var nScope = scope.$new(),
                        template = atNavMenu.getTemplate(),
                        el;

                    nScope.menu = scope.$eval(attr.menu);

                    if (attr.type === 'dropdown') {
                        nScope.cssClass = 'dropdown-menu';
                    } else {
                        nScope.cssClass = 'nav';
                    }


                    /**
                     * Check if is string template
                     */
                    if (angular.isString(template)) {
                        // patch template
                        el = angular.element(template);
                        template = el[0];
                        /**
                         * Append and compile it with new scope
                         */
                        element.append(template);
                        $compile(element.contents())(nScope);
                    }
                }
            }
        }
    ]
)