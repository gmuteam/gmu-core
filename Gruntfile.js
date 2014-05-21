/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    qunit: {
      files: ['test/test.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task.
  grunt.registerTask('test', ['qunit']);

};