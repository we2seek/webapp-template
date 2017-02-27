'use strict';

var browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

var path = {
    sass: ['app/sass/**/*.scss', 'app/sass/**/*.sass'],
    less: ['app/less/**/*.less'],
    css: ['app/css/*.css', '!app/css/*.min.css'],
    cssdest: 'app/css',
    js: ['app/js/**/*.js', '!app/js/**/*.min.js'],
    html: ['app/**/*.html'],
    vendor: {
        config: {
            base: 'bower_components'
        },
        dest: 'app/vendor',
        files: [
            'bower_components/angular/angular*.js',
            'bower_components/angular/angular*.css',
            'bower_components/angular-animate/angular-animate*.js',
            'bower_components/angular-bootstrap/ui-bootstrap*.css',
            'bower_components/angular-bootstrap/ui-bootstrap*.js',
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/bootstrap/dist/fonts/*',
            'bower_components/bootstrap/dist/js/bootstrap*.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jquery.easing/js/jquery.easing.js',
            'bower_components/jquery.easing/js/jquery.easing.min.js',
            'bower_components/font-awesome/css/font-awesome*.css',
            'bower_components/font-awesome/fonts/*'
        ]
    }
};

// Clean and copy vendor dists
gulp.task('clean-vendor', function(callback) {
    return del(path.vendor.dest, callback);
});

gulp.task('copy-vendor', ['clean-vendor'], function() {
    return gulp
        .src(path.vendor.files, path.vendor.config)
        .pipe(gulp.dest(path.vendor.dest));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(path.sass)
        .pipe(sass())
        .pipe(gulp.dest(path.cssdest))
        .pipe(browserSync.stream());
});

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src(path.less)
        .pipe(less())
        .pipe(gulp.dest(path.cssdest))
        .pipe(browserSync.stream());
});

// Minify compiled CSS
// gulp.task('minify-css', ['less'], function() {
gulp.task('minify-css', ['sass'], function() {
    return gulp.src(path.css)
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.cssdest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify JS
gulp.task('js', function() {
    return gulp.src(path.js)
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))

        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Static Server + watching scss/html files
gulp.task('serve', ['minify-css', 'js'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch(path.sass, ['minify-css']);
    // gulp.watch(path.less, ['minify-css']);
    gulp.watch(path.js, ['js']);
    gulp.watch(path.html).on('change', browserSync.reload);
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['copy-vendor', 'serve']);
