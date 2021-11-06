var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    babel = require('gulp-babel'),
    livereload = require('gulp-livereload');


/**************************************** HTML Task ************************************/
gulp.task('html', function(){
    return gulp.src('src/*.html')
            .pipe( gulp.dest('dist') )
            .pipe( notify({message: " HTML Task Initilized Successfully ", onLast: true}) )
            .pipe(livereload());
});

/**************************************** CSS Task ************************************/
gulp.task('css', function(){
            /* CSS */
    return gulp.src('src/css/*.css')
            .pipe( gulp.dest('dist/css') ),
            /* SASS */
            gulp.src('src/css/*.scss')
            .pipe( sourcemaps.init() )
            .pipe( sass({outputStyle: 'compressed'}) )
            .pipe( prefixer('last 2 versions') )
            .pipe( sourcemaps.write(".") )
            .pipe( gulp.dest('dist/css') )
            .pipe( notify({message: " CSS Task Initilized Successfully ", onLast: true}) )
            .pipe(livereload());
});

/**************************************** JavaScript Task ************************************/
gulp.task('js', function(){
    return gulp.src('src/js/*.js')
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe( uglify() )
            .pipe( gulp.dest('dist/js') )
            .pipe( notify({message: 'JavaScript Task Initilized Successfully', onLast: true}) )
            .pipe(livereload());
});

/**************************************** Images Task ************************************/
gulp.task('images', function(){
    return gulp.src('src/images/*.*')
        .pipe( imagemin({
                interlaced: true,
                progressive: true,
                optimizationLevel: 5,
                svgoPlugins: [
                    {
                        removeViewBox: true
                    }
                ]
            })
        )
        .pipe( gulp.dest('dist/images') )
        .pipe( notify({message: " Images Task Initilized Successfully ", onLast: true}) )
        .pipe(livereload());
});

/**************************************** Fonts Task ************************************/
gulp.task('fonts', function(){
    return gulp.src('src/fonts/*.*').pipe( gulp.dest('dist/fonts') )
            .pipe( notify({message: " Fonts Task Initilized Successfully ", onLast: true}) )
            .pipe(livereload());
});


/**************************************** Watch Task ************************************/
gulp.task('watch', function () {
    require("./server.js");
    livereload.listen();
    gulp.watch(
        ['./src/*.html'], gulp.series('html')
    );
    gulp.watch(
        ['./src/css/*.scss'], gulp.series('css')
    );
    gulp.watch(
        ['./src/js/*.js'], gulp.series('js')
    );
    gulp.watch(
        ['./src/images/*.*'], gulp.series('images')
    );
    gulp.watch(
        ['./src/fonts/*.*'], gulp.series('fonts')
    );
});