"use strict";

// General
const { src, dest, parallel, watch, series } = require('gulp'); // Gulp
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const del = require('del');
const cache = require('gulp-cache');

// Css
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const shorthand = require('gulp-shorthand');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const gcmq = require('gulp-group-css-media-queries');

// Js
const uglify = require('gulp-uglify');

// HTML
const pug = require('gulp-pug');
const gulpPugBeautify = require('gulp-pug-beautify');


// CSS Lib link
const cssLibs = [
	'app/libs/bootstrap/dist/css/bootstrap-reboot.css',
	'app/libs/bootstrap/dist/css/bootstrap-grid.css',
	'app/libs/slick/examples/css/style.css'
];

// JS Lib link
const jsLibs = [
	'app/libs/jquery/dist/jquery.js'
];

function browserSyncReload () {
	browserSync.init({
        server: {
            baseDir: "app/"
        },
        notify: false
    });
}

function pugTemplate () {
	return src('app/views/*.pug')
		.pipe(pug({pretty: true}))
		.pipe(dest('app/'))
		.pipe(gulpPugBeautify({ omit_empty: true }))
		.pipe(browserSync.stream());
}

function creatJsLibs () {
	del.sync('app/js/assets-js');

	if(!jsLibs.length == 0) {
		return src(jsLibs)
			.pipe(dest('app/js/assets-js'))
			.pipe(concat('libs.js'))
			.pipe(dest('app/js'))
			.pipe(uglify())
			.pipe(rename({suffix: '.min'}))
			.pipe(dest('app/js'));
	}

	else{
		return del.sync(
			[
				'app/js/libs.js',
				'app/js/libs.min.js',
				'app/js/assets-js'
			]
		);
	}
}
 
function creatCssLibs () {
	del.sync('app/css/assets-css');

	if(!cssLibs.length == 0) {
		return src(cssLibs)
			.pipe(dest('app/css/assets-css'))
			.pipe(concat('libs.css'))
			.pipe(gcmq())
			.pipe(dest('app/css'))
			.pipe(cleanCSS({level: {1: {specialComments: 0}}}))
			.pipe(rename({suffix: '.min'}))
			.pipe(dest('app/css'));
	}
	else{
		return del.sync(
			[
				'app/css/libs.css',
				'app/css/libs.min.css',
				'app/css/assets-css/'
			]
		);
	}
}

function cssSass () {
	return src('app/sass/**/*.scss')
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
		.pipe(shorthand())
		.pipe(gcmq())
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
		.pipe(cleanCSS({level: {1: {specialComments: 0}}}))
		.pipe(rename({suffix: '.min'}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream());
}

function watchFiles () {
	watch("app/sass/**/*.scss", cssSass);
	watch("app/js/**/*.js").on('change', browserSync.reload);
	watch("app/views/**/*.pug", pugTemplate);
}

function deleteDistFolder () {
	return del.sync('dist');
}

async function finish () {
	const finishCss = src('app/css/**/*.css')
		.pipe(dest('dist/css'));

	const finishImages = src('app/images/**/*')
		.pipe(dest('dist/images'));

	const finishJs = src('app/js/**/*.js')
		.pipe(dest('dist/js'));

	const finishFont = src('app/fonts/**/*')
		.pipe(dest('dist/fonts'));

	const finishHtml = src('app/*.html')
		.pipe(dest('dist'));
} 

exports.default = parallel(cssSass, pugTemplate, creatCssLibs, creatJsLibs, watchFiles, browserSyncReload);
exports.finish = parallel(deleteDistFolder, finish);