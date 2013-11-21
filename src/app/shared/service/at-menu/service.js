/**
 * Created by igi on 16.11.13.
 */
angularTrainer.register.service(
    'atMenu',
    [   '$exceptionHandler',
        function ($exceptionHandler) {
            /**
             * Menu array like object
             * @type {{}}
             */
            var menuData = {}, self = this;
            /**
             * Menu packages
             * @type {*|Array}
             */
            this.menuPackages = angularTrainer.getPackages().filter(function (value) {
                return angular.isDefined(value.menu);
            });

            /**
             * Set menu data
             * @param name
             * @param data
             */
            this.set = function (name, data) {
                if (!menuData[name]) {
                    menuData[name] = [];
                }
                if (angular.isArray(data)) {
                    data.forEach(function (value) {
                        menuData[name].push(value);
                    });
                } else if (angular.isObject(data)) {
                    menuData[name].push(data);
                } else {
                    $exceptionHandler('atMenu data value is not supported type');
                }
            };


            /**
             * Get menu data by name
             * @param name
             */
            this.get = function (name) {
                return menuData[name] !== undefined ? menuData[name] : null;
            };

            /**
             * Set menu from packages
             */
            this.menuPackages.forEach(function (component) {
                self.set(component.menu.name, component.menu);
            });

        }
    ]
)