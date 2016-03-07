var gulp = require('gulp'),
        connect = require('gulp-connect'),
        jshint = require('gulp-jshint'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        opn = require('opn'),
        uglify = require('gulp-uglify'),
        jsSrc = [
            './src/wrapper/start.js',
            './src/utils.js',
            './src/const.js',
            './src/List.js',
            './src/MediumEditorList.js',
            './src/wrapper/stop.js'
        ];


gulp.task('connect', function () {
    connect.server({
        root: './',
        port: 1337,
        livereload: true
    });
});

gulp.task('html', function () {
    return gulp.src('./example.html')
            .pipe(connect.reload());
});


gulp.task('scripts', function () {
    return gulp.src(jsSrc)
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(concat('all.js'))
            .pipe(rename(function (path) {
                path.basename = 'medium-editor-list';
            }))
            .pipe(gulp.dest('build'))
            .pipe(connect.reload());
});

gulp.task('build-prod', function () {
    return gulp.src(jsSrc)
            .pipe(concat('all.js'))
            .pipe(uglify())
            .pipe(rename(function (path) {
                path.basename = 'medium-editor-list-min';
            }))
            .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
    gulp.watch(['./src/**/*.js'], ['scripts']);
    gulp.watch(['./example.html'], ['html']);
});

gulp.task('open', function () {
    opn('http://localhost:1337/example.html', {app: ['chrome']});
});

gulp.task('default', ['connect', 'scripts', 'open', 'watch']);