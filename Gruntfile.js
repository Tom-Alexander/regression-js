module.exports = function (grunt) {
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        preserveComments: 'some',
      },
      build: {
        src: 'src/regression.js',
        dest: 'build/regression.min.js',
      },
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['tests/**/*.js'],
      },
    },
    eslint: {
      target: [
        'src/**/*.js',
        'tests/**/*.js',
      ],
    },
  });

  // Default task(s).
  grunt.registerTask('default', ['eslint', 'uglify']);
  grunt.registerTask('test', ['eslint', 'mochaTest']);
};
