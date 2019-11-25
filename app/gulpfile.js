var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
var concat = require('gulp-concat');
var del = require('del');

gulp.task('clean', () => {
   return del([
       `/templates/{theme}/main.js`,
       `/templates/{theme}/style.css`,

   ]);
});

gulp.task('styles:theme1', function () {
    del(['templates/theme1/style.css'])
    return gulp.src('templates/theme1/scss/base.scss')
        .pipe(sass())
        .pipe(gulp.dest('templates/theme1/'))
});

gulp.task('js:theme1', function () {
    del(['templates/theme1/main.js'])
    return pipeline(
        gulp.src('templates/theme1/js/**/*.js'),
        concat('main.js'),
        uglify(),
        gulp.dest('templates/theme1')
    );
});

//Watch task
gulp.task('default', function () {
    gulp.watch('templates/', gulp.series('styles'));
});