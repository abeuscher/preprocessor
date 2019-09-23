var React = require("react");
var ReactDOM = require("react-dom");


var loginScreen = require("./pug-templates/login.pug");
var parseHTML = require("./utils/parse-html.js");

window.addEventListener("load", function(e) {
    console.log("We're loaded and good to go");
    console.log("A second thing!");
    var el = document.getElementById("login");
    console.log(el);
    el.appendChild(parseHTML(loginScreen()));
    fetch("http://beuscher.net/wp-json/wp/v2/webpage/")
        .then(response => response.json())
        .then(function(data) {
            console.log(data[0].title.rendered);
        });
    ReactDOM.render(
        React.createElement(Page),
        document.getElementById("app")
        );
});

class Page extends React.Component {
    render() {
      return <div dangerouslySetInnerHTML={{__html: require("./pug-templates/login.pug")()}}></div>;
    }
  }
