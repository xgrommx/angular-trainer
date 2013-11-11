/**
 *
 */
"use strict";

module.exports = function (grunt) {

	grunt.registerMultiTask('atRequire', 'Build process', function () {
		var fs = require('fs'),
			config = fs.readFileSync(this.data.from, "utf8"),
			data = JSON.parse(config),
			string;

		if (this.data.clearBaseUrl) {
			data.baseUrl = '/';
		}

        if (this.data.version) {
            data.urlArgs += this.data.version;
        }

		string = "define(function(){ return " + JSON.stringify(data) + "; });";
		fs.writeFile(this.data.to, string);
	});

}