/**
 * Created by igi on 10.11.13.
 */


var tests = [],
    shim = {};

for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/unitSpec\.js$/.test(file)) {
            tests.push(file);
            shim[file] = {
                "deps": [
                    'karma.bootstrap'
                ]
            }
        }
    }
}

var config = {
    "baseUrl": "/base/src",
    "paths": {
        "angular": "core/angular/angular",
        "angular-route": "core/angular-route/angular-route",
        "jquery": "core/jquery/jquery"
    },
    "shim": {
        "angular": {
            "deps": ["jquery"],
            "exports": "angular"
        },
        "angular-route": {
            "deps": [
                "angular"
            ]
        }
    },
    "deps": tests,
    "callback": window.__karma__.start,
    "urlArgs": "v=0.1.0",
    "waitSeconds": 5
};

function extend(source, dest) {
    var i;
    for (i in dest) {
        if (dest.hasOwnProperty(i)) {
            source[i] = dest[i];
        }
    }
}
extend(config.shim, shim);
require.config(config);


