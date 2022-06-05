const del = require('del');
const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const gulpPreprocess = require('gulp-preprocess');
const gulpRename = require('gulp-rename');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpTerser = require('gulp-terser');
const gulpUglify = require('gulp-uglify');

// -- BUILD NODE WITH DEBUG ----------------------------------------------------

function buildNodeWithDebug() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(buildNodeWithDebug) })
		.pipe(gulpPreprocess({ context: { TARGET: 'NODE', DEBUG: true } }))
		.pipe(gulpRename((path) => path.basename += '.debug'))
		.pipe(gulp.dest('./dist/node/'));
}

// -- BUILD NODE ---------------------------------------------------------------

function buildNode() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(buildNode) })
		.pipe(gulpPreprocess({ context: { TARGET: 'NODE', DEBUG: false } }))
		.pipe(gulp.dest('./dist/node/'));
}

// -- BUILD BROWSER ES6 MODULE WITH DEBUG --------------------------------------

function buildBrowserEs6ModuleWithDebug() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(buildBrowserEs6ModuleWithDebug) })
		.pipe(gulpPreprocess({ context: { TARGET: 'BROWSER_ES6_MODULE', DEBUG: true } }))
		.pipe(gulpRename((path) => path.basename += '.debug'))
		.pipe(gulp.dest('./dist/browser/es6-module/'));
}

// -- BUILD BROWSER ES6 MODULE -------------------------------------------------

function buildBrowserEs6Module() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(buildBrowserEs6Module) })
		.pipe(gulpPreprocess({ context: { TARGET: 'BROWSER_ES6_MODULE', DEBUG: false } }))
		.pipe(gulp.dest('./dist/browser/es6-module/'))
		.pipe(gulpRename((path) => path.basename += '.min'))
		.pipe(gulpSourcemaps.init())
		.pipe(gulpTerser())
		.pipe(gulpSourcemaps.write('.'))
		.pipe(gulp.dest('./dist/browser/es6-module/'));
}

// -- BUILD BROWSER ES6 WITH DEBUG ---------------------------------------------

function buildBrowserEs6WithDebug() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(buildBrowserEs6WithDebug) })
		.pipe(gulpPreprocess({ context: { TARGET: 'BROWSER_ES6', DEBUG: true } }))
		.pipe(gulpRename((path) => path.basename += '.debug'))
		.pipe(gulp.dest('./dist/browser/es6/'));
}

// -- BUILD BROWSER ES6 --------------------------------------------------------

function buildBrowserEs6() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(buildBrowserEs6) })
		.pipe(gulpPreprocess({ context: { TARGET: 'BROWSER_ES6', DEBUG: false } }))
		.pipe(gulp.dest('./dist/browser/es6/'))
		.pipe(gulpRename((path) => path.basename += '.min'))
		.pipe(gulpSourcemaps.init())
		.pipe(gulpTerser())
		.pipe(gulpSourcemaps.write('.'))
		.pipe(gulp.dest('./dist/browser/es6/'));
}

// -- BUILD BROWSER ES5 WITH DEBUG ---------------------------------------------

function buildBrowserEs5WithDebug() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(buildBrowserEs5WithDebug) })
		.pipe(gulpPreprocess({ context: { TARGET: 'BROWSER_ES5', DEBUG: true } }))
		.pipe(gulpBabel())
		.pipe(gulpRename((path) => path.basename += '.debug'))
		.pipe(gulp.dest('./dist/browser/es5/'));
}

// -- BUILD BROWSER ES5 --------------------------------------------------------

function buildBrowserEs5() {
	return gulp.src('./src/**/*.js', { since: gulp.lastRun(buildBrowserEs5) })
		.pipe(gulpPreprocess({ context: { TARGET: 'BROWSER_ES5', DEBUG: false } }))
		.pipe(gulpBabel())
		.pipe(gulp.dest('./dist/browser/es5/'))
		.pipe(gulpRename((path) => path.basename += '.min'))
		.pipe(gulpSourcemaps.init())
		.pipe(gulpUglify())
		.pipe(gulpSourcemaps.write('.'))
		.pipe(gulp.dest('./dist/browser/es5/'));
}

// - EXPORTS -------------------------------------------------------------------

function cleanup() {
	return del('./dist/');
}

const build = gulp.parallel(
	buildNodeWithDebug,
	buildNode,
	buildBrowserEs6ModuleWithDebug,
	buildBrowserEs6Module,
	buildBrowserEs6WithDebug,
	buildBrowserEs6,
	buildBrowserEs5WithDebug,
	buildBrowserEs5
);

function watch() {
	gulp.watch('src/**/*.js', build);
}

module.exports = {
	build: gulp.series(cleanup, build),
	watch: gulp.series(cleanup, build, watch)
};
