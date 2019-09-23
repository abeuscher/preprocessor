
var loginScreen = require("./pug-templates/login.pug");
var parseHTML = require("./utils/parse-html.js");

window.addEventListener("load", function(e) {

    var el = document.getElementById("app");

    fetch("http://beuscher.net/wp-json/wp/v2/webpage/")
        .then(response => response.json())
        .then(response => {
            el.appendChild(parseHTML(loginScreen(response[0])));
        });
});
