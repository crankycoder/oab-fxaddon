var {ToggleButton} = require("sdk/ui/button/toggle");
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require('sdk/tabs');
var ss = require("sdk/simple-storage");

var signup_sidebar = require("sdk/ui/sidebar").Sidebar({
      id: 'oabutton-signup-sidebar',
      title: 'Open Access Button',
      url: require("sdk/self").data.url("signup_sidebar.html"),
      onHide: handleHide,
      onDetach: handleHide
});

var standard_sidebar = require("sdk/ui/sidebar").Sidebar({
      id: 'oabutton-standard-sidebar',
      title: 'Open Access Button',
      url: require("sdk/self").data.url("standard_sidebar.html"),
      onHide: handleHide,
      onDetach: handleHide
});

var button = ToggleButton({
    id: "my-button",
    label: "my button",
    icon: {
        "16": "./images/oabutton-16.png",
        "32": "./images/oabutton-32.png",
        "64": "./images/oabutton-64.png"
    },
    onChange: handleChange
});

function handleChange (state) {
    if (typeof ss.storage.myEmailAddress === "undefined") {
        // TODO: No email set yet, we need to register
        ss.storage.myEmailAddress = "victor@crankycoder.com";
        console.log("Setting email address to : " + ss.storage.myEmailAddress);

        // push a message to the content script to open up the email
        // address input field and submit button
    } else {
        console.log("Got address : " + ss.storage.myEmailAddress);
    }

    // grab the current URL
    var current_url = tabs.activeTab.url;
    console.log(state.label + " checked state: " + state.checked);
    console.log("Current URL: " + current_url);
    if (state.checked) {
        if (typeof ss.storage.signup_toggle === "undefined") {
            ss.storage.signup_toggle = true;
            // TODO: send a message to the content panel to hide the
            // id=signup-form
            signup_sidebar.show();
        }  else {
            standard_sidebar.show();
        }
    } else {
        signup_sidebar.hide();
        standard_sidebar.hide();
    }
}

function handleHide() {
    button.state("window", {checked: false});
}


// from: https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Modifying_Web_Pages_Based_on_URL
// Import the page-mod API
var pageMod = require("sdk/page-mod");

// Create a page mod
// It will run a script whenever a ".org" URL is loaded
// The script replaces the page contents with a message
pageMod.PageMod({
  include: "*.wikipedia.org",
  contentScriptFile: [
    require("sdk/self").data.url("js/jquery/1.11.1/jquery.min.js"),
    require("sdk/self").data.url("js/oab-signalling.js")
  ],
  contentStyleFile: require("sdk/self").data.url("css/signalling-style.css")

});
