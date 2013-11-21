/**
 * Created by igi on 10.11.13.
 */
angularTrainer.register.controller("atRoot",
    ['$scope', 'atMenu',
        function ($scope, atMenu) {

            atMenu.set("rightHeadMenu", [
                {
                    title: 'Powered by AngularJs',
                    href: "http://www.angularjs.org/"
                }
            ]);

            $scope.pageTitle = 'Angular trainer';
        }
    ]
);