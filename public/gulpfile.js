let gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-clean-css'),
    jsmin = require('gulp-uglify');

let path = {
    html: [
        './*.html'
    ],
    styles: {
        src: [
            'node_modules/normalize.css/normalize.css',
            './assets/less/index.less'
        ],
        dependencies: [
            './assets/less/'
        ],
        name: 'style',
        dest: './build/'
    },
    scripts: {
        src: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/handlebars/dist/handlebars.js',
            './assets/js/*.js'
        ],
        name: 'scripts',
        dest: './build/'
    }
};
let watchersPath = {
    html: [
        './*.html'
    ],
    styles: [
        './assets/less/*.less'
    ],
    scripts: [
        './assets/js/*.js'
    ]
};

gulp.task('style', function () {
    return gulp.src(path.styles.src)
        .pipe(concat('style.less'))
        .pipe(less({
            paths: path.styles.dependencies
        }))
        /*.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))*/
        .pipe(rename(path.styles.name + '.css'))
        .pipe(gulp.dest(path.styles.dest))
        .pipe(cssmin())
        .pipe(rename(path.styles.name + '.min.css'))
        .pipe(gulp.dest(path.styles.dest));
});

gulp.task('scripts', function () {
    return gulp.src(path.scripts.src)
        .pipe(concat('scripts.js'))
        .pipe(rename(path.scripts.name + '.js'))
        .pipe(gulp.dest(path.scripts.dest))
        /*.pipe(jsmin())*/
        .pipe(rename(path.scripts.name + '.min.js'))
        .pipe(gulp.dest(path.scripts.dest));
});

gulp.task('watch', ['style', 'scripts'], function() {
    gulp.watch(watchersPath.html, ['html']);
    gulp.watch(watchersPath.styles, ['style']);
    gulp.watch(watchersPath.scripts, ['scripts']);
});

gulp.task('build', ['style', 'scripts']);
gulp.task('default', ['build']);


