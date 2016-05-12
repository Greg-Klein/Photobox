var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
    compass = require('gulp-compass'),
    livereload = require('gulp-livereload'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename');
 
gulp.task('scss', function(){
    
    gulp.src('src/css/**/*.scss')
    	.pipe(plumber())
    	.pipe(compass({
    		css: 'src/css',
    		sass: 'src/css',
    		style: 'nested'
    	}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(minifyCss())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(livereload());
})

gulp.task('js', function () {
 
	gulp.src('src/js/*.js')
    .pipe(uglify({preserveComments: 'license'}))
    .pipe(rename({
        suffix: ".min"
    }))
	.pipe(gulp.dest('dist/js/'))
	.pipe(livereload());
});

gulp.task('img', function () {
    gulp.src('src/css/img/**/*.{jpg,png,gif}')
    	.pipe(plumber())
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/css/img/'));

    gulp.src('src/images/**/*.{jpg,png,gif}')
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/images/'))
        .pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen();
  	gulp.watch('src/css/**/*.scss', ['scss']);
    gulp.watch('src/js/*.js', ['js']);
 
});
 
gulp.task('dist', ['scss', 'js', 'img']);