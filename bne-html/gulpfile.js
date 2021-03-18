var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var nunjucksRender = require('gulp-nunjucks-render');


// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('Hello Zell!');
})

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(autoprefixer('last 5 version'))
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    })); 
})


//nunjuks
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
  // Renders template with nunjucks
      .pipe(nunjucksRender({
        path: ['app/templates']
      }))
      // output files in app folder
      .pipe(gulp.dest('app'))
})


// Watchers
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', {readDelay: 100}, ['sass']);
  gulp.watch('app/pages/**/*.+(html|nunjucks)', ['nunjucks']);
  gulp.watch('app/templates/**/*.+(html|nunjucks)', ['nunjucks']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

// Optimization Tasks 
// ------------------


// Optimizing CSS and JavaScript 
gulp.task('useref', function() {

  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching img that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/img'))
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// Copying common js
gulp.task('commonjs', function() {
  return gulp.src('app/js/common.js')
      .pipe(gulp.dest('dist/js'))
})
gulp.task('jqjs', function() {
  return gulp.src('app/js/jquery.js')
      .pipe(gulp.dest('dist/js'))
})
// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'nunjucks', 'browserSync'], 'watch',
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts', 'commonjs', 'jqjs'],
    callback
  )
})

gulp.task('archive', () =>
gulp.src('dist/**/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('dist'))
)
