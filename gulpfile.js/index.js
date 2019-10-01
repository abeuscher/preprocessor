var settings = require("../settings.js")();
var bundleJS = require("./bundle-js.js");
var processCss = require("./process-css.js");
var buildTemplates = require("./build-templates.js");
var moveFiles = require("./move-files.js");

const { series, watch } = require('gulp');
function defaultTask(cb) {
    console.log("Begin processing " + settings.siteName);
    
    cb();
  }
  
exports.default = series(defaultTask,bundleJS,processCss,buildTemplates, moveFiles);