var settings = require("../settings.js")();

var fs = require("file-system");
var browserify = require("browserify");

const { src, dest, watch } = require('gulp');

function bundleJS(cb) {   
    function processJS() {
        for (i=0;i<settings.jsFiles.length;i++) {
            var f = settings.jsFiles[i];
            console.log("Processing JS file " + f.name);
            return browserify({
                "entries": f.srcDir+f.srcFileName,
                "debug":true
            })
            .transform("uglifyify", { global: true })
            .transform(require("pugify"))
            .bundle()
            .pipe(fs.createWriteStream(f.buildDir + f.buildFileName)); 
        }
      }
      processJS();
      for (i=0;i<settings.jsFiles.length;i++) {
        watch([settings.jsFiles[i].srcDir + "*", settings.jsFiles[i].srcDir + "**/*"], processJS);
      }
      cb();
  }

  module.exports = bundleJS;