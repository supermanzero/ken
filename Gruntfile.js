/*global module*/
'use strict';
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            build: {
                options: {
                    appDir: './',
                    baseUrl: './test',
                    dir: './build',
                    /*optimize: 'uglify2',
                     generateSourceMaps: false,
                     preserveLicenseComments: false,*/
                    // useSourceUrl: true,
//                    optimizeCss: 'standard',
                    paths: {
                        'a': 'a',
                        'b': 'b'
                    },
                    shim: {

                    },
                    modules: [{
                        name: 'b'
                    }]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');


    // 注册任务
    grunt.registerTask('default', [ 'requirejs']);
};