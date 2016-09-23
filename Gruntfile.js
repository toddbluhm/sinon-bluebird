module.exports = function (grunt) {
  grunt.initConfig({
    standard: {
      options: {
        format: true
      },
      app: {
        src: [
          '*.js',
          'test/**/*.js'
        ]
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
  })

  grunt.loadNpmTasks('grunt-standard')
  grunt.loadNpmTasks('grunt-mocha-test')

  grunt.registerTask('test', [
    'mochaTest'
  ])

  grunt.registerTask('default', [
    'standard',
    'test'
  ])
}
