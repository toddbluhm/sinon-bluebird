module.exports = function (grunt) {

  var files = [
    './*.js*',
    'test/**/*.js'
  ];

  grunt.initConfig({
    jshint: {
      all: files,
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jsbeautifier: {
      modify: {
        src: files,
        options: {
          config: '.jsbeautifyrc'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          timeout: 10000
        },
        src: [
          './test/*.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('clean', [
    'jsbeautifier:modify',
    'jshint'
  ]);

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'clean',
    'test'
  ]);
};
