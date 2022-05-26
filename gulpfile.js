//套件方法的引入
const { src, dest, watch, series, parallel } = require('gulp');

// html package
const fileinclude = require('gulp-file-include');
function includeHTML() {
    return src('src/*.html') // 來源
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        })) // fileinclude function
        .pipe(dest('./dist')); // 目的地
}

exports.html = includeHTML;


// js move
const babel = require('gulp-babel');
function moveJs() {
    return src('src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('dist/js'))
}


//img move
function moveImg() {
    return src('src/images/*.*').pipe(dest('dist/images'))
}


//productpages move
function moveProductPages() {
    return src('src/productpages/*.*').pipe(dest('dist/productpages'))
}


// 壓圖
const imagemin = require('gulp-imagemin');
function min_images() {
    return src('src/images/*.*')
        .pipe(imagemin([
            imagemin.mozjpeg({ quality: 80, progressive: true }) // 壓縮品質      quality越低 -> 壓縮越大 -> 品質越差 
        ]))
        .pipe(dest('dist/images'))
}

exports.mini_img = min_images


const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');


// sass ->css
function styleSass() {
    return src('./src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(dest('./dist/css'));
}


// 監看
function watchfile() {
    watch(['src/*.html', 'src/**/*.html'], includeHTML) // 監看html
    watch('src/js/*.js', moveJs) // 監看js
    watch(['src/images/*.*', 'src/images/**/*.*'], moveImg) // 監看img
    watch('src/productpages/*.*', moveProductPages) // 監看moveProductPages
    watch(['./src/sass/*.scss', './src/sass/**/*.scss'], styleSass) // 監看sass
}


// 瀏覽器同步
const browserSync = require('browser-sync');
const reload = browserSync.reload;
function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['src/*.html', 'src/**/*.html'], includeHTML).on('change', reload) // 監看html
    watch('src/js/*.js', moveJs).on('change', reload) // 監看js
    watch(['src/images/*.*', 'src/images/**/*.*'], moveImg).on('change', reload) // 監看 img
    watch('src/productpages/*.*', moveProductPages).on('change', reload) // 監看 moveProductPages
    watch(['./src/sass/*.scss', './src/sass/**/*.scss'], styleSass).on('change', reload) // 監看sass
    done();
}


// 監看
exports.w = series(parallel(moveJs, moveImg, includeHTML, moveProductPages, styleSass), watchfile)


//瀏覽器同步
exports.default = series(parallel(moveJs, includeHTML, styleSass, moveProductPages, moveImg), browser)