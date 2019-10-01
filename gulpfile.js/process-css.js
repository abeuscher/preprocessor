var settings = require("../settings.js")();

var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var autoprefixer = require('gulp-autoprefixer');

const { src, dest } = require('gulp');

function processCSS(cb) {
    for (i=0;i<settings.stylesheets.length;i++) {
        var s = settings.stylesheets[i];
        console.log("Processing Style sheet group " + s.name)
        src(s.srcDir + '*.scss')
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: ['node_modules/susy/sass']
        }))
        .on('error', function(error) {
          console.log(error);
          this.emit('end');
        })
        .pipe(autoprefixer())
        .pipe(cssmin({
          keepSpecialComments: true
        }))
        .pipe(dest(s.buildDir));
    }
    cb();
}

module.exports = processCSS;