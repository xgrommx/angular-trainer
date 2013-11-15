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
                    file = dir + '/' + file;
                    var stat = fs.statSync(file);
                    if (stat && stat.isDirectory()) results = results.concat(walk(file));
                    else results.push(file);
                });
                return results
            },
            list = [],
            re = new RegExp('package.json$'),
            parsed = [],
            string,
            self = this,
            cwd = path.resolve(this.data.cwd === undefined ? '' : this.data.cwd) + '/';


        this.data.path.forEach(function (pth) {
            var dir = path.resolve(cwd + pth),
                listPath = walk(dir);

            listPath.forEach(function (value) {
                list.push(value);
            });
        });


        list = list.filter(function (value) {
            if (re.test(value)) {
                return value;
            }
        });


        list.forEach(function (pth) {
            var data = JSON.parse(fs.readFileSync(pth, "utf8"));
            data.folder = pth.replace(cwd, '').replace(/package\.json$/, '');
            parsed.push(data);
        });
        var re = new RegExp('.*\/');
        var defineName = this.data.defineName !== undefined ? this.data.defineName : self.data.to.replace(re, '');

        var name = '"' + defineName + '",';

        string = "define(" + name + "function(){ return " + JSON.stringify(parsed) + "; });";

        setTimeout(function () {
            fs.writeFile(self.data.to, string);
            done();
        }, 0);

	});

}