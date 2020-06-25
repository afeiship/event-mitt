(function() {
  'use strict';

  var gulp = require('gulp');
  var pkgJson = require('../package.json');
  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del', '@feizheng/gulp-*']
  });

  gulp.task('scripts', function() {
    return gulp
      .src(['src/index.js'], { allowEmpty: true })
      .pipe($.feizheng.pkgHeader())
      .pipe($.umd({ namespace: () => 'EventMitt', exports: () => 'EventMitt' }))
      .pipe(gulp.dest('dist'))
      .pipe($.size({ title: '[ default size ]:' }))
      .pipe($.uglify())
      .pipe($.rename({ extname: '.min.js' }))
      .pipe(gulp.dest('dist'))
      .pipe($.size({ title: '[ minimize size ]:' }));
  });
})();
