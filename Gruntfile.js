module.exports = function( grunt ) {
	'use strict';

	// Load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration
	grunt.initConfig( {
		pkg:    grunt.file.readJSON( 'package.json' ),
		bower:	grunt.file.readJSON('.bowerrc'),
		jshint: {
			browser: {
				all: [
					'assets/js/**/*.js',
					'assets/js/test/**/*.js'
				],
				options: {
					jshintrc: '.jshintrc'
				}
			},
			grunt: {
				all: [
					'Gruntfile.js'
				],
				options: {
					jshintrc: '.gruntjshintrc'
				}
			}
		},
		// uglify to concat, minify, and make source maps
		uglify: {
			plugins: {
				options: {
					sourceMap: 'assets/js/plugins.js.map',
					sourceMappingURL: 'plugins.js.map',
					sourceMapPrefix: 2,
					banner: '/*! roots-ualib - Plugins - 2015-01-29 12:00\n' +
						' * Copyright (c) 2015;' +
						' * Licensed ECLv2+' +
						' */\n'
				},
				files: [{
					src: [
						'assets/js/source/plugins.js',
						// 'assets/js/vendor/yourplugin/yourplugin.js',
					],
					dest: 'assets/js/plugins.min.js'
				}]
			},
			main: {
				options: {
					sourceMap: 'assets/js/main.js.map',
					sourceMappingURL: 'main.js.map',
					sourceMapPrefix: 2,
					banner: '/*! roots-ualib 2015-01-29 12:00\n' +
						' * Copyright (c) 2015;' +
						' * Licensed ECLv2+' +
						' */\n'
				},
				files: [{
					src: [
						'assets/js/source/main.js'
					],
					dest: 'assets/js/main.min.js'
				}]
			}
		},
		test:   {
			files: ['assets/js/test/**/*.js']
		},
		less:   {
			all: {
				files: {
					'assets/css/main.css': 'assets/css/less/main.less'
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'assets/css/',
					src: '{,*/}*.css',
					dest: 'assets/css/'
				}]
			}
		},
		cssmin: {
			options: {
				banner: '/*!  - v0.1.4 - 2015-01-29 12:00\n' +
					' * Copyright (c) 2015;' +
					' * Licensed ECLv2+' +
					' */\n'
			},
			minify: {
				expand: true,
				cwd: 'assets/css/',
				src: ['main.css'],
				dest: 'assets/css/',
				ext: '.min.css'
			}
		},
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 7,
					progressive: true
				},
				files: [{
					expand: true,
					cwd: 'assets/img',
					src: '{,*/}*.{png,jpg,jpeg}',
					dest: 'assets/img/dist'
				}]
			}
		},
		versioning: {
			options: {
				cwd: 'assets/dist',
				output: 'php',
				outputConfigDir: 'lib'
			},
			dist: {
				files: [{
					assets: [{
						src: ['assets/js/vendor/modernizr.js'],
						dest: 'assets/js/vendor/modernizr.js'
					}],
					key: 'global',
					dest: 'js',
					type: 'js',
					ext: '.min.js'
				},{
					assets: '<%= uglify.plugins.files %>',
					key: 'global',
					dest: 'js',
					type: 'js',
					ext: '.min.js'
				}, {
					assets: '<%= uglify.main.files %>',
					key: 'global',
					dest: 'js',
					type: 'js',
					ext: '.min.js'
				}, {
					assets: [{
						src: ['assets/css/main.min.css'],
						dest: 'assets/css/main.min.css'
					}],
					key: 'global',
					dest: 'css',
					type: 'css',
					ext: '.min.css'
				}]
			}
		},
		// Generates a custom Modernizr build that includes only the tests you
		// reference in your app
		modernizr: {
			devFile: "bower_components/modernizr/modernizr.js",
			outputFile: "assets/js/vendor/modernizr.js",
			excludeFiles: [
				'assets/js/vendor/*'
			],

			// By default, source is uglified before saving
			uglify: true,

			// By default, this task will crawl your project for references to Modernizr tests.
			// Set to false to disable.
			parseFiles: false,

			// When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
			// You can override this by defining a "files" array below.
			files: [
				'assets/js/{,*/}*.js',
				'assets/css/{,*/}*.scss'
			]
		},
		watch:  {
			options: {
				livereload: true
			},
			less: {
				files: ['assets/css/less/*.less'],
				tasks: ['LESS', 'cssmin'],
				options: {
					debounceDelay: 500
				}
			},
			scripts: {
				files: ['assets/js/**/*.js', 'assets/js/vendor/**/*.js'],
				tasks: ['jshint', 'uglify'],
				options: {
					debounceDelay: 500
				}
			},
			markup: {
				files: ['**/*.php', '**/*.html'],
				livereload: true
			}
		},
		// deploy via rsync
		deploy: {
			options: {
				src: "./",
				args: ["--verbose"],
				exclude: ['.git*', 'node_modules', '.sass-cache', 'Gruntfile.js', 'package.json', '.DS_Store', 'README.md', 'config.rb', '.jshintrc', '.gruntjshintrc', '.editorconfig'],
				recursive: true,
				syncDestIgnoreExcl: true
			},
			staging: {
				options: {
					dest: "~/path/to/theme",
					host: "user@host.com"
				}
			},
			production: {
				options: {
					dest: "~/path/to/theme",
					host: "user@host.com"
				}
			}
		},
		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: false,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json', 'bower.json'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: 'origin',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
				globalReplace: false,
				prereleaseName: false,
				regExp: false
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= bower.directory %>/fontawesome/fonts',
					src: ['**'],
					dest: 'assets/dist/fonts',
					filter: 'isFile'
				}]
			},
			dev: {
				files: [{
					expand: true,
					cwd: '<%= bower.directory %>/fontawesome/fonts',
					src: ['**'],
					dest: 'assets/fonts',
					filter: 'isFile'
				}]
			}
		}
	} );

	// Default task.
	grunt.registerTask( 'default', [
		'jshint',
		'uglify',
		'less',
		'autoprefixer',
		'cssmin',
		'modernizr',
		'versioning'
	] );

	grunt.registerTask( 'dev', ['watch'] );
	grunt.registerTask( 'vendor', ['less'] );

	grunt.util.linefeed = '\n';
};
