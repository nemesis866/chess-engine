// Agregamos las dependencias
var gulp = require('gulp'),
	connect = require('gulp-connect'),
	historyApiFallback = require('connect-history-api-fallback'),
	inject = require('gulp-inject'),
	wiredep = require('wiredep').stream;

// Creamos el servidor web
gulp.task('server', function (){
	connect.server({
		root: './app',
		port: 3000,
		livereload: true,
		middleware: function (connect, opt){
			return [historyApiFallback({})];
		}
	});
});

// Recargamos los html cuando alla cambios
gulp.task('html', function (){
	gulp.src('./app/**/*.html')
	.pipe(connect.reload());
});

// Inyectamos archivos css y js propios al index.html
gulp.task('inject', ['wiredep'] ,function (){
	var sources = gulp.src(['./app/scripts/**/*.js', './app/styles/**/*.css']);

	return gulp.src('index.html', {
		cwd: './app'
	})
	.pipe(inject(sources, {
		read: false,
		ignorePath: '/app'
	}))
	.pipe(gulp.dest('./app'));
});

// Inyectamos dependencias instaladas con bower
gulp.task('wiredep', function (){
	return gulp.src('index.html', {
		cwd: './app'
	})
	.pipe(wiredep({
		directory: './app/vendor',
		read: false,
		onError: function (err){
			console.log(err.code);
		}
	}))
	.pipe(gulp.dest('./app'));
});

// Dejamos en escucha las tareas
gulp.task('watch', function (){
	gulp.watch(['./app/**/*.html'], ['html']);
	gulp.watch(['./app/scripts/**/*.js'], ['inject']);
	gulp.watch(['./app/styles/**/*.css'], ['inject']);
	gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['inject', 'server', 'watch']);