/**
 * Created by igi on 10.11.13.
 */
(function (window, document) {
    requirejs(['require-config', 'require-packages', 'ng-amd'], function (config, packages, NgAmd) {
        /**
         * Setup config
         */
        require.config(config);
        /**
         * BootStrapHelper
         * @type {NgAmd}
         */
        var bootstrapHelper = new NgAmd();
        /**
         * Folder structore for types
         */
        bootstrapHelper.setFolderStructure({
            'factory': 'app/core/factory',
            'service': 'app/core/service',
            'value': 'app/core/value',
            'animation': 'app/core/animation',
            'filter': 'app/core/filter',
            'controller': 'app/core/controller',
            'directive': 'app/core/directive',
            'module': 'app/core/modules'
        });
        /**
         * Set packages
         */
        bootstrapHelper.setPackages(packages);
        /**
         * Publish api to window
         * @type {*}
         */
        window.angularTrainer = bootstrapHelper.publishPublicApi(
            (function () {
                var html = document.getElementsByTagName('html')[0];
                return html.getAttribute('data-require-js-min') === "true";
            }())
        );
        /**
         * Load angular and setup module
         */
        requirejs(['angular', 'angular-route'], function (angular) {
            /**
             * Set module
             */
            bootstrapHelper.setModule(angular.module('angularTrainer', ['ngRoute', 'ngAMD']));
            /**
             * Bootstrap application
             */
            requirejs(['app/config/config', 'app/config/run'], function () {
                angular.bootstrap(document, ['angularTrainer']);
            });
        });

    });
}(window, document, undefined));