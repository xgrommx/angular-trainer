/**
 *
 */
"use strict";

module.exports = function (grunt) {

	grunt.registerMultiTask('atConfig', 'Dependency check process', function () {
		var done = this.async(),
			fs = require('fs'),
			path = require('path'),
			walk = function (dir) {
				var results = [];
				var list = fs.readdirSync(dir);
				list.forEach(function (file) {
					file = dir + '/' + file
					var stat = fs.statSync(file);
					if (stat && stat.isDirectory()) results = results.concat(walk(file));
					else results.push(file)
				});
				return results
			},
			list = [],
			re = new RegExp('package.json$'),
			parsed = [],
			string;

		this.data.path.forEach(function(pth){
			var dir = path.resolve(pth),
				listPath = walk(dir);
			listPath.forEach(function(value){
				list.push(value);
			});
		});

		list = list.filter(function(value){
			if(re.test(value)){
				return value;
			}
		});


		list.forEach(function(pth){
			parsed.push(JSON.parse(fs.readFileSync(pth, "utf8")));
		});

        console.log(list);

		string = "define(function(){ return " + JSON.stringify(parsed) + "; });";

        var writeTo = path.resolve(this.data.to);


		setTimeout(function(){

			fs.writeFile(writeTo, string, function(error){
                console.log(error);
            });
			done();
		}, 0);


	});

}