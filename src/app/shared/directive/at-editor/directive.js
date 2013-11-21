/**
 * Created by igi on 17.11.13.
 */
angularTrainer.register.directive(
    'atEditor',
    [
        function () {
            return {
                restrict: 'A',
                compile: function (tElement, tAttr) {
                    var ace = angularTrainer.get('ace').edit(tAttr.id);
                    ace.setTheme("ace/theme/monokai");
                    ace.getSession().setMode("ace/mode/javascript");
                }
            };
        }
    ]
);