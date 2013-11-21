/**
 * Created by igi on 21.11.13.
 */
angularTrainer.register.directive(
    'atControllerLoader',
    [   '$compile', '$parse', '$http', '$templateCache', '$animate', '$anchorScroll', '$controller',
        function ($compile, $parse, $http, $templateCache, $animate, $anchorScroll, $controller) {
            return {
                restrict: 'EA',
                transclude: 'element',
                controller: function ($scope) {
                    /**
                     * Get layout
                     * @param name
                     * @returns {string}
                     */
                    this.getLayout = function (name) {
                        return angularTrainer.getPath(name, 'controller') + 'template.html';
                    };

                    /**
                     * Load layout
                     * @param url
                     */
                    this.loadLayout = function (url) {
                        return $http.get(this.getLayout(url), {cache: $templateCache});
                    }
                },
                compile: function (element, attr) {


                    return function (scope, $element, $attr, controller, $transclude) {

                        var currentScope,
                            onloadExp = attr.onload || '',
                            autoScrollExp = attr.autoscroll,
                            currentElement,
                            cleanupLastIncludeContent = function () {
                                if (currentScope) {
                                    currentScope.$destroy();
                                    currentScope = null;
                                }
                                if (currentElement) {
                                    $animate.leave(currentElement);
                                    currentElement = null;
                                }
                            },
                            loadController = $parse($attr.atControllerLoader || $attr.atController)(scope);


                        if (loadController) {
                            angularTrainer.requirejs({
                                controller: loadController
                            }, function () {
                                controller.loadLayout(loadController).success(function (template) {
                                    if (template) {
                                        var newScope = scope.$new();
                                        $transclude(newScope, function (clone) {
                                            clone.html(template);
                                            $animate.enter(clone, null, currentElement || $element, function onNgViewEnter() {
                                                if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                                    $anchorScroll();
                                                }
                                            });
                                            cleanupLastIncludeContent();
                                            var link = $compile(clone.contents());
                                            currentScope = newScope;
                                            currentElement = clone;
                                            var controller = $controller(loadController, {$scope: newScope});
                                            clone.data('$ngControllerController', controller);
                                            clone.children().data('$ngControllerController', controller);
                                            link(currentScope);
                                            currentScope.$emit('$atControllerContentLoaded');
                                            currentScope.$eval(onloadExp);
                                        });
                                    } else {
                                        cleanupLastIncludeContent();
                                    }
                                })
                                .error(function () {
                                    cleanupLastIncludeContent();
                                });
                                scope.$emit('$atControllerContentRequested');
                            });
                        }
                    };
                }
            }
        }
    ]
);