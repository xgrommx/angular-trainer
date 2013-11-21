/**
 * Created by igi on 10.11.13.
 */
angularTrainer.define({
    require: [
        'app/config/routes'
    ],
    controller: [
        'atRoot'
    ]
}, function (routes) {

    angularTrainer.register.config([
        '$locationProvider', '$routeProvider',
        function ($location, $route) {

            routes.forEach(function (value) {
                $route.when(value.route, value.options);
            });
            $route.otherwise({ redirectTo: '/error' });
            $location.html5Mode(true);
        }
    ]);
});
