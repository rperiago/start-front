'use strict'

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug2')
var mainBowerFiles = require('main-bower-files');
var reload = browserSync.reload;

gulp.task('sass', function () {
  gulp.src('app/scss/style.scss')
    .pipe(sass({
      includePaths: ['app/scss'],
    })).on('error', sass.logError)
    .pipe(gulp.dest('app/styles'))
    .pipe(reload({stream: true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('app/styles'))
});

gulp.task("bower-files", function () {
  return gulp.src(mainBowerFiles(/* options */), {base: 'bower_components'})
    .pipe(gulp.dest("app/scripts/libs/"))
});

gulp.task('uglify', function () {
  gulp.src('app/scripts/main.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/scripts'))
    .pipe(reload({stream: true}))
});
gulp.task('views:render', function() {
    return gulp.src('app/views/**/*.pug')
        .pipe(pug({ yourTemplate: 'Locals' }))
        .pipe(gulp.dest('app/'))
        // => build/views/example.html
});

gulp.task('views:compile', function() {
    return gulp.src('app/views/**/*.pug')
        .pipe(pug.compile())
        .pipe(gulp.dest('app/'))
});

// observa mudanças em arquivos na pasta SCSS e SCRIPTS
gulp.task('serve', ['sass', 'bower-files', 'views:render'], function () {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch('app/scripts/**/*.js', ['uglify'])
  gulp.watch('app/scss/**/*.scss', ['sass'])
  gulp.watch('app/views/**/*.pug', ['views:render'])
  gulp.watch(
    ['*.html', 'scripts/**/*.js'],
    {cwd: 'app'},
    reload
  )
});
