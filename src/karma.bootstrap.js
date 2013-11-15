/**
 * Created by igi on 10.11.13.
 */

define([
    "karma.test.package",
    "ng-amd",
    "angular",
    "angular-route"
], function (packages, NgAmd, angular) {

    /**
     * BootStrapHelper
     * @type {NgAmd}
     */
    var bootstrapHelper = new NgAmd();
    /**
     * Base url required for fetching templates
     * @todo combine templates in one to eliminate  http requests also :)
     */
    bootstrapHelper.setBaseUrl('/base/src');
    /**
     * Set packages
     */
    bootstrapHelper.setPackages(packages);
    /**
     * Set module
     */
    bootstrapHelper.setModule(angular.module('angularTrainer', ['ngRoute', 'ngAMD']));

    return  window.angularTrainer = bootstrapHelper.publishPublicApi(false);
});

