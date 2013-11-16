'use strict';

var modRewrite = require('connect-modrewrite');
var modOptions = modRewrite([
	'!\\.html|\\.js|\\.svg|\\.ttf|\\.woff|\\.eot|\\.css|\\.swf|\\.jp(e?)g|\\.png|\\.gif$ /index.html'
]);
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	var mountFolder = function (connect, dir) {
		return connect.static(require('path').resolve(dir));
	},
		bowerJSON = grunt.file.readJSON('bower.json');


    require('./node_custom/config/requre')(grunt);
    require('./node_custom/config/config')(grunt);
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var config = {
		dev: 'dev',
		release: 'release',
        version: 'v=' + bowerJSON.version
	};


	config.dataMain = 'bootstrap.js?'+config.version;


	grunt.initConfig({
		pkg: bowerJSON,
		config: config,
		connect: {
			options: {
				port: 9000,
				hostname: 'localhost'
			},
			dev: {
				options: {
					middleware: function (connect) {
						return [
							modOptions,
							mountFolder(connect, config.dev),
							mountFolder(connect, 'src')
						];
					}
				}
			},
			release: {
				options: {
					port: 9001,
					middleware: function (connect) {
						return [
							modOptions,
							mountFolder(connect, config.release)
						];
					}
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			files: ['src/**/*.html'],
			less: {
				files: 'src/**/*.less',
				tasks: ['less:dev']
			},
			bower: {
				files: 'bower.json',
				tasks: ['clean']
			}
		},
		clean: {
			dev: [config.dev + '/'],
			release: [config.release + '/']
		},
		concat: {
			release: {
				src: [
					'src/app/**/*.js'
				],
				dest: config.release + '/app/built.js'
			}
		},
		copy: {
			dev: {
				files: [
                    {
                        src: 'src/empty',
                        dest:  config.dev + '/require-packages.js'
                    },
                    {
                        src: 'src/empty',
                        dest: config.release + '/require-packages.js'
                    },
					{
						src: 'src/index.html',
						dest: config.dev + '/index.html'
					}
				]
			},
			release: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: [
							'bootstrap/**',
							'core/**',
							'extra/**',
							'lib/**/*.html',
							'widgets/**'
						],
						dest: config.release + '/app/'
					},
					{
						expand: true,
						cwd: 'src/resources/',
						src: [
							'views/**'
						],
						dest: config.release + '/'
					},
					{
						expand: true,
						cwd: 'src/resources/',
						src: [
							'styles/**'
						],
						dest: config.release + '/'
					},
					{
						expand: true,
						cwd: 'src/resources/',
						src: [
							'img/**'
						],
						dest: config.release + '/'
					},
					{
						src: 'src/bootstrap.js',
						dest: config.release + '/bootstrap.js'
					},
					{
						src: 'src/index.html',
						dest: config.release + '/index.html'
					}
				]
			}
		},
		less: {
			dev: {
				src: 'src/less/all.less',
				dest: config.dev + '/styles/all.css'
			},
			release: {
				src: 'src/less/all.less',
				dest: config.release + '/styles/all.css'
			}
		},
		replace: {
			dev: {
				src: 'src/templates/index.html',
				dest: config.dev + '/index.html',
				replacements: [
					{
						from: '[REQUIRE-JS-MIN]',
						to: 'data-require-js-min="false"'
					},
					{
						from: '[REPLACE_BASE_PATH]',
						to: '/'
					},
					{
						from: '[REPLACE_DATA_MAIN]',
						to: config.dataMain
					}
				]
			},
			release: {
				src: 'src/templates/index.html',
				dest: config.release + '/index.html',
				replacements: [
					{
						from: '[REQUIRE-JS-MIN]',
						to: 'data-require-js-min="true"'
					},
					{
						from: '[REPLACE_BASE_PATH]',
						to: config.baseUrl
					},
					{
						from: '[REPLACE_DATA_MAIN]',
						to: config.dataMain
					}
				]
			}
		},
		open: {
			server: {
				url: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				require: true,
				define: true,
				requirejs: true,
				describe: true,
				expect: true,
				it: true
			},
			all: [
				'Gruntfile.js',
				'<%= config.app %>/scripts/{,*/}*.js'
			]
		},

		atRequire: {
			dev: {
                defineName: 'require-config',
				clearBaseUrl: false,
				from: 'src/config.json',
                version: config.version,
				to: config.dev + '/require-config.js'
			},
			release: {
                defineName: 'require-config',
				clearBaseUrl: false,
				from: 'src/config.json',
                version: config.version,
				to: config.release + '/require-config.js'
			}
		},
		atConfig: {
			dev: {
                defineName: 'require-packages',
                cwd: 'src/',
				path: [
					'app/'
				],
				to: config.dev + '/require-packages.js'
			},
			release: {
                defineName: 'require-packages',
                cwd: 'src/',
				path: [
					'src/app/'
				],
				to: config.release + '/require-packages.js'
			}
		},
        karma: {
            all: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        protractor: {
            all: {
                configFile: "protractor.conf.js", // Target-specific config file,
                keepAlive: false,
                options: {
                    args: {} // Target-specific arguments
                }
            }
        }
	});


	grunt.registerTask('server', function (target) {
		grunt.task.run([
			'clean:dev',
			'copy:dev',
            'atRequire:dev',
            'atConfig:dev',
			'less:dev',
			'replace:dev',
			'connect:dev:keepalive'
		]);
	});

    grunt.registerTask('test', [
        'test:unit',
        'test:e2e'
    ]);

    grunt.registerTask('test:e2e', [
        'protractor:all'
    ]);

    grunt.registerTask('test:unit', [
        'karma:all'
    ]);

	grunt.registerTask('default', [
		'server'
	]);
};
