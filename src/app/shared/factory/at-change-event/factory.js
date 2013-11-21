/**
 * Created by igi on 17.11.13.
 */
angularTrainer.register.factory(
    'atChangeEvent',
    [
        function () {


            function ChangeEvent(fn) {
                /**
                 * Change event
                 */
                if (!fn) {
                    throw new Error('Callback must be provided');
                }
                /**
                 * Change callback
                 * @type {*}
                 */
                this.changeCallback = fn;
                /**
                 * Binded
                 * @type {Array}
                 */
                this.binded = [];
            }

            /**
             * Change event prototype
             * @type {{}}
             */
            ChangeEvent.prototype = {
                /**
                 * Bind change items
                 * @param obj
                 */
                bind: function (obj, isNotCollection) {
                    if (isNotCollection) {
                        this.binded = obj;
                    } else {
                        this.binded.push(obj);
                    }
                },
                /**
                 * Register change
                 * @param obj
                 */
                change: function () {
                    this.changeCallback.apply(this, arguments);
                }
            }

            return ChangeEvent;
        }
    ]
);