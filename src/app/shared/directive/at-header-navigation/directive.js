/**
 * Created by igi on 16.11.13.
 */
angularTrainer.register.directive(
    'atHeaderNav',
    [
        function () {
            return {
                restrict: 'E',
                templateUrl: angularTrainer.template('atHeaderNav', 'directive')
            }
        }
    ]
);