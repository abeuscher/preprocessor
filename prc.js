var srcDir = "./src/";
var buildDir = "./public_html/";

var jsSrcDir = srcDir + "js/";
var jsBuildDir = buildDir + "js/";

var templateSrcDir = srcDir + "templates/";
var templateBuildDir = buildDir;

var sassSrcDir = srcDir + "scss/";
var sassBuildDir = buildDir;

var assetsSrcDir = srcDir + "public_assets";
var assetsBuildDir = buildDir;

var fs = require("file-system");
var browserify = require("browserify");
var pug = require("pug");
var pugPhpFilter = require("pug-php-filter");
var sass = require("node-sass");
var Watcher = require("node-sass-watcher");
var precss = require("precss");
var postcss = require("postcss");
var cssnano = require("cssnano");
var autoprefixer = require("autoprefixer");
var ncp = require("ncp").ncp;

var siteSettings = {};
siteSettings.jsFiles = [
  {
    name: "main",
    srcDir: jsSrcDir,
    srcFileName: "app.js",
    buildDir: jsBuildDir,
    buildFileName: "bundle.js",
    processor: bundleJsFile,
    watchFunc: doJS
  }
];
siteSettings.templates = [
  {
    name: "main-templates",
    srcDir: templateSrcDir,
    buildDir: templateBuildDir,
    fileExtension: ".php",
    pugOpts: {
      pretty: true,
      filters: {
        php: pugPhpFilter
      },
      locals: {
        siteurl: ""
      }
    },
    processor: writePug,
    watchFunc: doTemplates
  }
];
siteSettings.stylesheets = [
  {
    name: "main-styles",
    srcDir: sassSrcDir,
    buildDir: sassBuildDir,
    processor: writeSass,
    watchFunc: doCSS
  }
];
siteSettings.assets = [
  {
    name: "main-styles",
    srcDir: assetsSrcDir,
    buildDir: assetsBuildDir,
    processor: copyAssets,
    watchFunc: doAssets
  }
];
function doJS() {
  processjsFiles(siteSettings.jsFiles);
}
function doTemplates() {
  processTemplates(siteSettings.templates);
}
function doCSS() {
  processStyleSheets(siteSettings.stylesheets);
}
function doAssets() {
  processAssets(siteSettings.assets);
}

function run() {
  doJS();
  doTemplates();
  doCSS();
  doAssets();
}

run();

var fsWait = false;

function fileChanged(eventType, filename) {
  console.log(filename + " changed");
}

function processAssets(a) {
  for (i = 0; i < a.length; i++) {
    a[i].processor(a[i]);
    watchFile(a[i].srcDir, a[i].watchFunc);
  }
}
function copyAssets(assetObj) {
  checkDir(assetObj.buildDir);
  ncp(assetObj.srcDir, assetObj.buildDir, function(err) {
    if (err) {
      console.log("Asset Copy Error: ", err);
    }
    console.log(
      "Finished moving assets from " +
        assetObj.srcDir +
        " to " +
        assetObj.buildDir
    );
  });
}
function processjsFiles(files, name) {
  if (name != "") {
    for (i = 0; i < files.length; i++) {
      files[i].processor(files[i]);
      watchFile(files[i].srcDir, files[i].watchFunc);
    }
  }
}

function bundleJsFile(f) {
  checkDir(f.buildDir);
  var b = browserify();
  b.add(f.srcDir + f.srcFileName);
  b.transform("uglifyify", { global: true });
  b.transform(require("pugify"));
  var ws = fs.createWriteStream(f.buildDir + f.buildFileName);
  console.log(f.srcDir + f.srcFileName + " bundled");
  console.log(f.buildDir + f.buildFileName + " written");
  return b.bundle().pipe(ws);
}

function processTemplates(t) {
  for (i = 0; i < t.length; i++) {
    fs.recurse(t[i].srcDir, ["*.pug"], t[i].processor);
    watchFile(t[i].srcDir, t[i].watchFunc);
  }
}
function writePug(filepath, filename, relative) {
  var processedFile = pug.renderFile(
    filepath,
    siteSettings.templates[0].pugOpts
  );
  var targetFile =
    siteSettings.templates[0].buildDir +
    filename.substring(0, filename.length - 4) +
    ".php";
  fs.writeFile(targetFile, processedFile);
}
function checkDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function processStyleSheets(s) {
  for (i = 0; i < s.length; i++) {
    fs.recurse(s[i].srcDir, ["*.scss"], s[i].processor);
  }
}
function writeSass(filepath, filename, relative) {
  var targetFile =
    siteSettings.stylesheets[0].buildDir +
    filename.substring(0, filename.length - 5) +
    ".css";
  function render() {
    console.warn('Rendering "' + filepath + '" file...');
    var renderIt = function() {
      sass.render({ file: filepath }, function(err, result) {
        if (err) {
          console.log(err.message);
          return;
        }

        var processor = postcss([precss(), autoprefixer(), cssnano()]);

        processor.process(result.css.toString()).then(
          function(result) {
            console.warn('Outputting to "' + targetFile + '" file...');
            var temp = fs.writeFile(targetFile, result.css);
            if (result.map) {
              fs.writeFile(targetFile + ".map", result.map, () => true);
            }
          },
          function(err) {
            console.error("Error: " + err.message);
          }
        );
      });
    };
    setTimeout(renderIt, 3000);
  }

  var watcherOptions = {
    verbosity: 1
  };
  // Start watching
  var watcher = new Watcher(filepath, watcherOptions);
  watcher.on("init", render);
  watcher.on("update", render);
  watcher.run();
}
function watchFile(path, cb) {
  console.log("Watching", path);
  fs.watch(path, function(e, f) {
    if (fsWait) return;
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    cb(e, f);
  });
}
module.exports = {
    "runsite" : run()
}