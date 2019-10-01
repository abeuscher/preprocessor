var srcDir = "./src/";
var buildDir = "./public_html/";

var jsSrcDir = srcDir + "js/";
var jsBuildDir = buildDir + "js/";

var templateSrcDir = srcDir + "templates/";
var templateBuildDir = buildDir;

var sassSrcDir = srcDir + "scss/";
var sassBuildDir = buildDir;

var assetsSrcDir = srcDir + "public_assets/";
var assetsBuildDir = buildDir;

function siteSettings() {
  return {
    siteName: "Al's new Preprocessor",
    jsFiles: [
      {
        name: "Main Bundle",
        srcDir: jsSrcDir,
        srcFileName: "app.js",
        buildDir: jsBuildDir,
        buildFileName: "bundle.js"
      },
      {
        name: "Secondary Bundle",
        srcDir: jsSrcDir,
        srcFileName: "app2.js",
        buildDir: jsBuildDir,
        buildFileName: "bundle2.js"
      }
    ],
    templates: [
      {
        name: "Main Template Group",
        srcDir: templateSrcDir,
        buildDir: templateBuildDir
      }
    ],
    stylesheets: [
      {
        name: "Main Stylesheet",
        srcDir: sassSrcDir,
        buildDir: sassBuildDir
      }
    ],
    assets: [
      {
        name: "Main Public Assets",
        srcDir: [assetsSrcDir + "**/*"],
        buildDir: assetsBuildDir
      }
    ]
  };
}
module.exports = siteSettings;
