var gulp = require('gulp'),
        connect = require('gulp-connect'),
        jshint = require('gulp-jshint'),
        browserify = require('gulp-browserify'),
        rename = require('gulp-rename'),
        opn = require('opn');


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
    return gulp.src('src/index.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(browserify({
                insertGlobals: true
            }))
            .pipe(rename(function (path) {
                path.basename = 'bundle';
            }))
            .pipe(gulp.dest('build'))
            .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./src/**/*.js'], ['scripts']);
    gulp.watch(['./example.html'], ['html']);
});

gulp.task('open', function(){
    opn('http://localhost:1337/example.html');
});

gulp.task('default', ['connect', 'scripts', 'open', 'watch']);