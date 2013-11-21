/**
 * Created by igi on 10.11.13.
 */
angularTrainer.register.controller("atRoot",
    ['$scope', 'atMenu',
        function ($scope, atMenu) {



            atMenu.set("rightHeadMenu", [
                {
                    title: 'Github',
                    href: "https://github.com/igorzg/",
                    type: "blank"
                },
                {
                    title: 'About me',
                    href: "http://www.igorivanovic.info/",
                    type: "blank"
                },
                {
                    title: 'Powered by AngularJs',
                    href: "http://www.angularjs.org/"
                }
            ]);

            $scope.pageTitle = 'Angular trainer';
        }
    ]
);