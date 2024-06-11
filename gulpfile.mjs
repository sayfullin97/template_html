import del from 'del';

import fs from 'fs';

async function clean() {
  await fs.promises.rm('build', { recursive: true, force: true });
}
 


import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import cleanCSS from 'gulp-clean-css';
import preprocess from 'gulp-preprocess';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import fileInclude from 'gulp-file-include';


const sass = gulpSass(dartSass);
const bs = browserSync.create();

const paths = {
  html: 'src/**/*.html',
  sass: 'src/sass/**/*.sass',
  js: 'src/js/**/*.js',
  img: 'src/img/**/*',
  fonts: 'src/fonts/**/*',
  libs: 'src/libs/**/*'
};
 
function styles() {
  return gulp.src('src/sass/style.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/css'))
    .pipe(bs.stream());
}

function html() {
  return gulp.src('src/**/*.html')
    .pipe(fileInclude({
      basepath: 'src'
    }))
    .pipe(preprocess())
    .pipe(gulp.dest('build'))
    .pipe(bs.stream());
}

function scripts() {
  return gulp.src(paths.js)
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/js'))
    .pipe(bs.stream());
}

function images() {
  return gulp.src(paths.img)
    .pipe(gulp.dest('build/img'))
    .pipe(bs.stream());
}

function fonts() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('build/fonts'))
    .pipe(bs.stream());
}

function libs() {
  return gulp.src(paths.libs)
    .pipe(gulp.dest('build/libs'))
    .pipe(bs.stream());
}

function serve() {
  bs.init({
    server: {
      baseDir: 'build'
    }
  });

  gulp.watch(paths.html, html);
  gulp.watch(paths.sass, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.img, images);
  gulp.watch(paths.fonts, fonts);
  gulp.watch(paths.libs, libs);
}

function includeHTML() {
  return gulp.src('src/**/*.html')
    .pipe(fileInclude({
      basepath: 'src'
    }))
    .pipe(gulp.dest('build'));
}

 
const build = gulp.series(clean, gulp.parallel(styles, html, scripts, images, fonts, libs, includeHTML));

const watch = gulp.series(build, serve);

export {
  clean,
  styles,
  html,
  scripts,
  images,
  fonts,
  libs,
  watch,
  serve
};

export default build;
