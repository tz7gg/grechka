'use strict';

require('dotenv').config();

const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

const browserSync = require('browser-sync').create();
// const browserSync = 		require('browser-sync');
// const reload = 			browserSync.reload;

const gutil = require('gulp-util');

const postcss = require('gulp-postcss');
const precss = require('precss');
const shortcss = require('postcss-short');
const cleancss = require('gulp-clean-css');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
// const svgSprite = 		require('gulp-svg-sprite');
const inlinesvg = require('postcss-inline-svg');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const fileinclude = require('gulp-file-include');
const changedInPlace = require('gulp-changed-in-place');
const ftp = require('vinyl-ftp');

const plumberOptions = {
    errorHandler: function(err) {
        notify.onError({
            title: 'Gulp error in ' + err.plugin,
            message: err.toString(),
        })(err);
    },
};

function compileMarkup() {
    return (
        gulp
        .src(['src/html/[^_]*.*'])
        .pipe(plumber(plumberOptions))
        .pipe(
            fileinclude({
                prefix: '@@',
                basepath: '@file',
            })
        )
        // .pipe(changedInPlace())
        .pipe(gulp.dest('layout/'))
        .pipe(browserSync.stream())
    );
}

function svgTransport() {
    return (
        gulp
        .src(['src/svg/*.svg'])
        // .pipe(changedInPlace())
        .pipe(gulp.dest('layout/assets/svg/'))
        .pipe(browserSync.stream())
    );
}

function compileStylesLibs() {
    return gulp
        .src([
            'src/**/modern-reset.css',
            'src/**/jquery-ui.min.css',
            'src/**/jquery.jcrop.css',
            'src/**/slick.css',
            'src/**/intlTelInput.min.css',
        ])
        .pipe(plumber(plumberOptions))
        .pipe(sourcemaps.init())
        .pipe(concat('libs.min.css'))
        .pipe(cleancss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('layout/assets/css/'))
        .pipe(browserSync.stream());
}

// function compileStylesLibs() {
//   return gulp
//     .src(['src/css/libs-css/*.css'])
//     .pipe(gulp.dest('layout/assets/css/'))
//     .pipe(browserSync.stream());
// }

const postcssSettings = {
    features: {
        'custom-selectors': true,
        'custom-properties': true,
        'custom-media-queries': true,
        'nesting-rules': true,
        'media-query-ranges': true,
        'custom-selector': true,
        'system-ui': true,
    },
};
const inlineSvgOptions = {
    encode: function encode(code) {
        return code
            .replace(/"/g, "'")
            .replace(/%/g, '%25')
            .replace(/&/g, '%26')
            .replace(/#/g, '%23')
            .replace(/{/g, '%7B')
            .replace(/}/g, '%7D')
            .replace(/</g, '%3C')
            .replace(/>/g, '%3E');
    },
};

function compileStyles() {
    return gulp
        .src([
            'src/**/fonts.css',
            'src/**/color-theme.css',
            'src/**/snippets.css',
            'src/**/common.css',
            'src/**/*-block.css',
            'src/**/col.css',
            'src/**/atomic.css',
        ])
        .pipe(plumber(plumberOptions))
        .pipe(sourcemaps.init())
        .pipe(concat('styles.min.css'))
        .pipe(
            postcss([precss(postcssSettings), inlinesvg(inlineSvgOptions), shortcss])
        )
        .pipe(cleancss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('layout/assets/css/'))
        .pipe(browserSync.stream());
}



function compileScripts() {
    return gulp
        .src(['src/js/my-js/*.js', '!src/js/my-js/__foundation.js'])
        .pipe(plumber(plumberOptions))
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['@babel/env'],
            })
        )
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('layout/assets/js/'))
        .pipe(browserSync.stream());
}


const compile = gulp.parallel(
    compileMarkup,
    svgTransport,
    compileStylesLibs,
    compileStyles,
    compileScripts
);

function reload(done) {
    browserSync.reload();
    done();
}

function startServer(done) {
    browserSync.init({
        server: {
            baseDir: 'layout/',
        },
        notify: false,
        open: process.env.BROWSER === 'none' ? false : true,
    });
    // done();
}

const watchMarkup = function() {
    gulp.watch('src/html/**/*.*', gulp.series(compileMarkup));
    gulp.watch('src/svg/*.svg', gulp.series(svgTransport));
};
const watchStyles = function() {
    gulp.watch('src/css/libs-css/*.css', gulp.series(compileStylesLibs));
    gulp.watch('src/css/my-css/*.css', gulp.series(compileStyles));
};
const watchScripts = function() {
    gulp.watch('src/js/my-js/*.js', gulp.series(compileScripts));
};

var serve = gulp.series(compile, startServer);

var watch = gulp.parallel(watchMarkup, watchStyles, watchScripts);

exports.default = gulp.parallel(serve, watch);

exports.libs = gulp.series(compileStylesLibs);