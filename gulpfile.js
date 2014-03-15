'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    watch = require('gulp-watch'),
    through = require('through2'),
    gulpFilter = require('gulp-filter'),
    exec = require('child_process').exec,
    gutil = require('gulp-util'),
    clean = require('gulp-clean');

gulp.task('default', ['watch']);

gulp.task('clean', function() {
  return gulp.src('tmp/**', {read: false})
    .pipe(clean());
});

gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', 'test/**/*.js', 'lib/**/*.js'])
    .pipe(jshint('jshint.json'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', ['clean'], function() {
  return gulp.src(['test/**/test-*.js'], {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch', function() {
  return gulp.src(['lib/**/*.js', 'test/**'], {read: false})
    .pipe(watch({emit: 'all'}, function(files) {
      files
        .pipe(gulpFilter('test-*.js'))
        .pipe(mocha({reporter: 'spec'}))
        .on('error', function(err) {
          if (!/tests? failed/.test(err.stack)) {
            console.log(err.stack);
          }
        });
    }));
});
