module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: '\n\n'
            },
            dist: {
                src: [
                    'scripts/namespace.js',
                    'scripts/base.js',
                    'scripts/helper/namespace.js',
                    'scripts/helper/key-spline.js',
                    'scripts/helper/helper.js',
                    'scripts/def/namespace.js',
                    'scripts/def/def.js',
                    'scripts/math/namespace.js',
                    'scripts/math/math.js',
                    'scripts/hash.js',
                    'scripts/event.js',
                    'scripts/event-listener.js',
                    'scripts/properties.js',
                    'scripts/methods.js',
                    'scripts/view.js',
                    'scripts/animation.js',
                    'scripts/context-menu.js',
                    'scripts/camera/namespace.js',
                    'scripts/camera/default-camera.js',
                    'scripts/rendered-object/namespace.js',
                    'scripts/rendered-object/base.js',
                    'scripts/rendered-object/rectangle.js',
                    'scripts/rendered-object/circle.js',
                    'scripts/rendered-object/text.js',
                    'scripts/rendered-object/line-path.js',
                    'scripts/rendered-object/path.js',
                    'scripts/rendered-object/svg.js',
                    'scripts/rendered-object/image.js'
                ],
                dest: 'dist/zui.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/zui.min.js': ['dist/zui.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', [
        'concat',
        'uglify'
    ]);

    grunt.registerTask('default', ['build']);
};