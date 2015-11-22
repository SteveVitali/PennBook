var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var reactify = require('reactify');
var watchify = require('watchify');

gulp.task('browserify', function() {
  var bundler = browserify({
    entries: ['./public/js/index.jsx'],
    paths: ['./node_modules','./public/js'],
    transform: [babelify],
    debug: true,
    // Required properties for watchify
    cache: {}, packageCache: {}, fullPaths: true
  });
  var watcher = watchify(bundler);
  return watcher.on('update', function() {
      var updateStart = Date.now();
      watcher.bundle()
        .pipe(source('main.js'))
        // We can add uglifying/etc. here later
        .pipe(gulp.dest('./public/build/'));
      console.log('Updated in', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create initial bundle on task start
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/build/'));
});

gulp.task('default', ['browserify']);
