var gulp = require('gulp'); // Подключаем Gulp
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const del = require('del');

gulp.task('clear:build', function(){
	return del('./build')
})

gulp.task('pug', function(callback){
	return gulp.src('./src/pug/pages/**/*.pug')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Pug',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe( pug(
			{pretty:true}
		))
		.pipe( gulp.dest('./build/'))
		.pipe(browserSync.stream())
	callback();
})

gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	});
});

function reload(done) {
	browserSync.reload();
	done();
};

gulp.task('copy:img', function(callback){
	return gulp.src('./src/img/**/*.*')
		.pipe(gulp.dest('./build/img'))
	callback()
});

gulp.task('copy:lib', function(callback){
	return gulp.src('./src/lib/**/*.*')
		.pipe(gulp.dest('./build/lib'))
	callback()
});

gulp.task('copy:js', function(callback){
	return gulp.src('./src/js/**/*.js')
		.pipe(gulp.dest('./build/js'))
	callback()
});
gulp.task('copy:mediacss', function(callback){
	return gulp.src('./src/scss/media.css')
		.pipe(gulp.dest('./build/css'))
	callback()
});

gulp.task('watch', function() {
	gulp.watch(['.build/js/**/*.*', './build/img/**/*.*']).on('change', browserSync.reload);
	gulp.watch('./src/scss/**/*.scss',  gulp.parallel('scss') );
	gulp.watch('./src/pug/**/*.pug',  gulp.parallel('pug') );
	gulp.watch('./src/img/**/*.*',  gulp.parallel('copy:img') );
	gulp.watch('./src/js/**/*.*',  gulp.parallel('copy:js') );
	gulp.watch('./src/lib/**/*.*',  gulp.parallel('copy:lib') );
	gulp.watch('./src/lib/**/*.*',  gulp.parallel('copy:mediacss') );

});


gulp.task('scss', function(callback) {
	return gulp.src('./src/scss/style.scss')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe( sass() )
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}))
		.pipe( gulp.dest('./build/css/') )
		.pipe(browserSync.stream())
	callback();
});
// Задача для старта сервера из папки app


gulp.task(
	'default',
	gulp.series(
		gulp.parallel('clear:build'),
		gulp.parallel('copy:img', 'copy:js', 'copy:mediacss', 'copy:lib', 'scss', 'pug'),
		gulp.parallel('server', 'watch')
	)
);
