var settings = require("../settings.js")();

const { src, dest } = require('gulp');

var checkDir = require("./check-dir.js");

function moveFiles(cb) {
    for (i=0;i<settings.assets.length;i++) {
        var f = settings.assets[i];
        console.log("Moving file set " + f.name);
        checkDir(f.buildDir);
        src(f.srcDir)
        .pipe(dest(f.buildDir));
    }
    cb();
}

module.exports = moveFiles;