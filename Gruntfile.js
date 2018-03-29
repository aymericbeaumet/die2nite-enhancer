/*
 * This Gruntfile is used to develop, test and compile this project. Here are
 * the callable tasks:
 *
 *   - `grunt compile`
 *       Concatenate all the files present in ./sources/ into one.
 *
 *   - `grunt pack`
 *       Call `grunt compile` and then pack the compiled script into the
 *       different wrappers.
 *
 *   - `grunt pack --chrome --firefox`
 *       Same as `grunt pack` but only for the specified wrappers (available
 *       wrappers: 'chrome', 'chrome_zip', 'firefox', 'opera' and
 *       'userscript').
 *
 *   - `grunt test`
 *       Run the `test:*` tasks.
 *
 *   - `grunt test:static_check`:
 *       Run `grunt compile`, `grunt jsvalidate` and then `grunt jshint`.
 *
 *   - `grunt test:unit`:
 *       Run `grunt karma:run`.
 *
 *   - `grunt dev`:
 *       Recompile the packages and launch the static analysis and the unit
 *       tests on the fly.
 *
 *   - `grunt devfast`:
 *       Recompile the packages on the fly.
 *
 *   - `grunt dev --userscript --firefox`:
 *       Same as `grunt dev` but only for the specified wrappers (see the `grunt
 *       pack` comment above for the available wrappers).
 *
 */

/*jshint node:true */

module.exports = function(grunt) {

    "use strict";

    /*
     * Modules
     */
    var userhome = require("userhome");
    var merge = require("merge");
    var path = require("path");


    /*
     * Load placeholders
     */
    var placeholders = grunt.file.readJSON("placeholders.json");


    /*
     * Configuration
     */

    var config = {
        buildDir: path.join(path.resolve(), "build"), // Use an absolute path to fix problems when using the external extension compilers
        iconsDir: path.join(path.resolve(), "icons"),
        imagesDir: path.join(path.resolve(), "images"),
        testsDir: path.join(path.resolve(), "tests"),
        wrappersDir: path.join(path.resolve(), "wrappers"),
        jQueryDir: path.join(path.resolve(), "node_modules", "jquery", "dist"),

        path: {
            firefox: "web-ext", // npm install web-ext
            chrome: path.join(path.resolve(), "crxmake.sh"),
            chrome_pem: path.join(userhome(), ".d2ne", "chrome.pem"), // Generated by Chrome the first time
            openssl: "openssl",
            zip: "zip"
        },

        compiled_script: {},
        userscript: {},
        chrome: {},
        chrome_zip: {},
        firefox: {},
        opera: {}
    };

    config.compiled_script.outputFile = path.join(config.buildDir, placeholders.compiled_script);
    config.userscript.outputFile = path.join(config.buildDir, "userscript.user.js");
    config.chrome.outputFile = path.join(config.buildDir, "chrome.crx");
    config.chrome_zip.outputFile = path.join(config.buildDir, "chrome.zip");
    config.firefox.outputFile = path.join(config.buildDir, "firefox.xpi");
    config.opera.outputFile = path.join(config.buildDir, "opera.nex");

    config.compiled_script.workingDir = null;
    config.userscript.workingDir = path.join(config.buildDir, "userscript");
    config.chrome.workingDir = path.join(config.buildDir, "chrome");
    config.chrome_zip.workingDir = path.join(config.buildDir, "chrome");
    config.firefox.workingDir = path.join(config.buildDir, "firefox");
    config.opera.workingDir = path.join(config.buildDir, "opera");

    config.compiled_script.inputDir = path.join(path.resolve(), "sources");
    config.userscript.inputDir = path.join(config.wrappersDir, "userscript");
    config.chrome.inputDir = path.join(config.wrappersDir, "chrome");
    config.chrome_zip.inputDir = path.join(config.wrappersDir, "chrome");
    config.firefox.inputDir = path.join(config.wrappersDir, "firefox");
    config.opera.inputDir = path.join(config.wrappersDir, "opera");


    /*
     * Grunt init
     */

    grunt.config.init({
        pkg: grunt.file.readJSON("package.json"),

        _pack: {
            userscript: {
                custom: function(workingDir, OutputFile) {
                    grunt.task.run("concat:pack_userscript");
                }
            },
            chrome: {
                custom: function(workingDir, OutputFile) {
                    grunt.task.run("shell:pack_chrome");
                }
            },
            chrome_zip: {
                custom: function(workingDir, OutputFile) {
                    grunt.task.run("shell:pack_chrome_zip");
                }
            },
            firefox: {
                custom: function(workingDir, OutputFile) {
                    grunt.task.run("shell:pack_firefox");
                }
            },
            opera: {
                custom: function(workingDir, OutputFile) {
                    grunt.task.run("shell:pack_opera");
                }
            }
        },

        clean: {
            all: [config.buildDir],
            all_working_dirs: [
                config.userscript.workingDir,
                config.chrome.workingDir,
                config.chrome_zip.workingDir,
                config.firefox.workingDir,
                config.opera.workingDir
            ],
            userscript: [config.userscript.workingDir],
            chrome: [config.chrome.workingDir],
            chrome_zip: [config.chrome_zip.workingDir],
            firefox: [config.firefox.workingDir],
            opera: [config.opera.workingDir]
        },

        concat: {
            options: {
                separator: "\n"
            },
            compiled_script: {
                src: [
                    path.join(config.compiled_script.inputDir, "libs", "*.js"),
                    path.join(config.compiled_script.inputDir, "header.js"),
                    path.join(config.compiled_script.inputDir, "classes", "*.js"),
                    path.join(config.compiled_script.inputDir, "modules", "*.js"),
                    path.join(config.compiled_script.inputDir, "footer.js")
                ],
                dest: config.compiled_script.outputFile
            },
            pack_userscript: {
                src: [path.join(config.userscript.workingDir, "metadata.js"),
                      config.compiled_script.outputFile],
                dest: config.userscript.outputFile,
                options: {
                    process: function(content) {
                        return grunt.template.process(content, {
                            data: merge(grunt.config("pkg"), placeholders)
                        });
                    }
                }
            }
        },

        copy: {
            options: {
                process: function(content) {
                    return grunt.template.process(content, {
                        data: merge(grunt.config("pkg"), placeholders)
                    });
                },
                processContentExclude: [path.join("**", "*.png")]
            },

            userscript: {
                cwd: config.userscript.inputDir,
                src: ["**"],
                dest: config.userscript.workingDir,
                filter: "isFile",
                expand: true
            },
            chrome: {
                files: [
                    {
                        cwd: config.chrome.inputDir,
                        src: ["**"],
                        dest: config.chrome.workingDir,
                        filter: "isFile",
                        expand: true
                    },
                    {
                        src: [config.compiled_script.outputFile],
                        dest: config.chrome.workingDir,
                        filter: "isFile",
                        expand: true,
                        flatten: true
                    },
                    {
                        cwd: config.iconsDir,
                        src: ["icon48.png", "icon128.png"],
                        dest: config.chrome.workingDir,
                        filter: "isFile",
                        expand: true
                    },
                    {
                        cwd: config.imagesDir,
                        src: ["**"],
                        dest: path.join(config.chrome.workingDir, "images"),
                        filter: "isFile",
                        expand: true
                    },
                    {
                        cwd: config.jQueryDir,
                        src: ["jquery.min.js"],
                        dest: config.chrome.workingDir,
                        filter: "isFile",
                        expand: true
                    }
                ]
            },
            chrome_zip: {
                files: [
                    {
                        cwd: config.chrome_zip.inputDir,
                        src: ["**"],
                        dest: config.chrome_zip.workingDir,
                        filter: "isFile",
                        expand: true
                    },
                    {
                        src: [config.compiled_script.outputFile],
                        dest: config.chrome_zip.workingDir,
                        filter: "isFile",
                        expand: true,
                        flatten: true
                    },
                    {
                        cwd: config.iconsDir,
                        src: ["icon48.png", "icon128.png"],
                        dest: config.chrome_zip.workingDir,
                        filter: "isFile",
                        expand: true
                    },
                    {
                        cwd: config.imagesDir,
                        src: ["**"],
                        dest: path.join(config.chrome_zip.workingDir, "images"),
                        filter: "isFile",
                        expand: true
                    },
                    {
                        cwd: config.jQueryDir,
                        src: ["jquery.min.js"],
                        dest: config.chrome_zip.workingDir,
                        filter: "isFile",
                        expand: true
                    }
                ]
            },
            firefox: {
                files: [
                    {
                        cwd: config.firefox.inputDir,
                        src: ["**"],
                        dest: config.firefox.workingDir,
                        filter: "isFile",
                        expand: true
                    },
                    {
                        src: [config.compiled_script.outputFile],
                        dest: config.firefox.workingDir,
                        filter: "isFile",
                        expand: true,
                        flatten: true
                    },
                    {
                        cwd: config.iconsDir,
                        src: ["icon48.png", "icon96.png"],
                        dest: config.firefox.workingDir,
                        filter: "isFile",
                        expand: true
                    },
                    {
                        cwd: config.imagesDir,
                        src: ["**"],
                        dest: path.join(config.firefox.workingDir, "images"),
                        filter: "isFile",
                        expand: true
                    },
                    {
                        cwd: config.jQueryDir,
                        src: ["jquery.min.js"],
                        dest: config.firefox.workingDir,
                        filter: "isFile",
                        expand: true
                    }
                ]
            },
            opera: {
                files: [
                    {
                        cwd: config.opera.inputDir,
                        src: ["**"],
                        dest: config.opera.workingDir,
                        filter: "isFile",
                        expand: true
                    },
                    {
                        src: [config.compiled_script.outputFile],
                        dest: config.opera.workingDir,
                        filter: "isFile",
                        expand: true,
                        flatten: true
                    },
                    {
                        cwd: config.iconsDir,
                        src: ["icon48.png", "icon128.png"],
                        dest: config.opera.workingDir,
                        filter: "isFile",
                        expand: true
                    },
                    {
                        cwd: config.imagesDir,
                        src: ["**"],
                        dest: path.join(config.opera.workingDir, "images"),
                        filter: "isFile",
                        expand: true
                    },
                    {
                        cwd: config.jQueryDir,
                        src: ["jquery.min.js"],
                        dest: config.opera.workingDir,
                        filter: "isFile",
                        expand: true
                    }
                ]
            }
        },

        shell: {
            options: {
                stdout: false
            },
            pack_chrome: {
                command: function() {
                    var cmd = "sh " + config.path.chrome + " " + config.chrome.workingDir + " " + config.path.chrome_pem + " " + config.buildDir + "";
					return cmd;
                }
            },
            pack_chrome_zip: {
                command: function() {
                    var cmd = "cd " + config.chrome_zip.workingDir + " && " + config.path.zip + " " + config.chrome_zip.outputFile + " *";
                    return cmd;
                }
            },
            pack_firefox: {
                command: function () {
                    //var cmd = "cd " + config.firefox.workingDir + " && " + config.path.zip + " " + config.firefox.outputFile + " *";
                    var cmd = config.path.firefox+ " build -s " + config.firefox.workingDir + " -a " + config.buildDir + " && mv " + config.buildDir + "/die2nite_enhancer*.zip " + config.firefox.outputFile;
                    return cmd;
                }
            },
            pack_opera: {
                command: function() {
                    var cmd =
                        "sh " + config.path.chrome + " " + config.opera.workingDir + " " + config.path.chrome_pem + " " + config.buildDir + " && " +
						"mv " + path.join(config.buildDir, "opera.crx") + " " + config.opera.outputFile + "";
                    return cmd;
                }
            }
        },

        karma: {
            options: {
                configFile: path.join(config.testsDir, "karma.conf.js")
            },

            continuous: {
                singleRun: true,
                browsers: ["Firefox"],
                reporters: ["dots", "coverage"],

                // CoverAlls

                preprocessors: {
                    "sources/classes/*.js" : ["coverage"]
                },

                coverageReporter: {
                    type: "lcov",
                    dir: "coverage/"
                }
            },

            // Should be launched by `grunt:dev`
            background: {
                background: true
            }
        },

        coveralls: {
            options: {
                coverage_dir: "coverage/Firefox 19.0.0 (Linux)/"
            }
        },

        watch: {
            karma: {
                // if a test file is modified, relaunch the tests
                files: [
                    "tests/**/*"
                ],
                tasks: ["karma:background:run"]
            },
            pack: {
                // if a source file is modified, re-statically check the files
                // and re-pack
                files: [
                    "sources/**/*.js",
                    "wrappers/**/*"
                ],
                tasks: ["static_check", "pack"]
            },
            copy: {
                // if a source file is modified, re-statically check the files
                // and re-copy
                files: [
                    "sources/**/*.js",
                    "wrappers/**/*"
                ],
                tasks: ["static_check", "copy"]
            }
        },

        jsvalidate: {
            options:{
                globals: {},
                esprimaOptions: {},
                verbose: false
            },
            compiled_script:{
                files: {
                    src: [
                        'Gruntfile.js',
                        path.join(config.testsDir, '**', '*.js'),
                        config.compiled_script.outputFile
                    ]
                }
            }
        },

        jshint: {
            src: [
                'Gruntfile.js',
                path.join(config.testsDir, '**', '*.js'),
                config.compiled_script.outputFile
            ]
        }
    });


    /*
     * Register custom tasks
     */

    grunt.registerTask("default", "Call the task `pack`.", ["pack"]);

    grunt.registerTask("pack", "Pack all the extensions", function(target) {
        var options = false;

        grunt.task.run("compile");

        // Browse all the possible _pack. Pack it if the concerned wrapper
        // options is found and enabled.
        var _packs = grunt.config("_pack");

        for (var key in _packs) {
            if (_packs.hasOwnProperty(key) &&
                typeof grunt.option(key) !== "undefined" && grunt.option(key) === true) {

                options = true;
                grunt.task.run("copy:" + key);
                grunt.task.run("_pack:" + key);
                grunt.task.run("clean:" + key);
            }
        }

        // if no options provided, pack everything
        if (!options) {
            grunt.task.run("copy");
            grunt.task.run("_pack");
            grunt.task.run("clean:all_working_dirs");
        }
    });

    grunt.registerMultiTask("_pack", " ", function() {
        // If the target needs a custom process
        if (typeof this.data.custom === "function") {
            // Use file(s) in the working directory to generate the output file
            this.data.custom(this.data.workingDir, this.data.outputFile);
        }
    });

    grunt.registerTask("test", "Launch the static tests and the unit tests.", function(target) {
        var tests = ["static_check", "karma:continuous"];

        // if no target provided, launch all the tests
        if (typeof target === "undefined") {
            tests.forEach(function(test) {
                grunt.task.run(test);
            });
        } else {
            // else launch the test if it is known
            if (tests.indexOf(target) > -1) {
                grunt.task.run(target);
            } else {
                grunt.warn("test:" + target + " does not exist.");
            }
        }
    });

    grunt.registerTask("static_check", "Statically check the JS files.", ["compile", "jsvalidate", "jshint"]);

    grunt.registerTask("compile", "Concatenate the JavaScript files into one.", ["clean:all", "concat:compiled_script"]);

    grunt.registerTask("dev", "Watch for modifications and recompile/relaunch tests on the fly.", ["karma:background:start", "watch"]);

    grunt.registerTask("devfast", "Watch for modifications and recompile on the fly.", ["watch:pack"]);

    grunt.registerTask("copyfast", "Watch for modifications and recopy on the fly.", ["copy", "watch:copy"]);


    /*
     * Load NPM tasks
     */

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-jsvalidate");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks('grunt-karma-coveralls');
    grunt.loadNpmTasks("grunt-shell");

};
