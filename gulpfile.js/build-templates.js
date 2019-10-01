var settings = require("../settings.js")();

var pug = require("gulp-pug");
var pugPhpFilter = require("pug-php-filter");
var extReplace = require('gulp-ext-replace');

const { src, dest, watch } = require('gulp');

function buildTemplates(cb) {
    function processTemplates() {
        for (i=0;i<settings.templates.length;i++) {
            var t = settings.templates[i];
            console.log("Processing template set " + t.name);
            return src(t.srcDir + '*.pug')
            .pipe(pug({
              "pretty": true,
              "filters": {
                "php": pugPhpFilter
              },
              "extension": "php",
              "locals": {
                siteurl: ""
              }
            }))
            .pipe(extReplace(".php"))
            .pipe(dest(t.buildDir));
        }
    }
    processTemplates();
    for (i=0;i<settings.templates.length;i++) {
        watch([settings.templates[i].srcDir + "*.pug",settings.templates[i].srcDir + "**/*.pug"], processTemplates);
    }
    cb();
}
module.exports = buildTemplates;