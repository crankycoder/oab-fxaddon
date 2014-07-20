var {ToggleButton} = require("sdk/ui/button/toggle");
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require('tabs');

var button = ToggleButton({
    id: "my-button",
    label: "my button",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
    width: 200,
    height: 300,
    contentURL: self.data.url("panel.html"),
    onHide: handleHide
});

function handleChange (state) {
    // grab the current URL
    var current_url = tabs.activeTab.url;
    console.log(state.label + " checked state: " + state.checked);
    console.log("Current URL: " + current_url);
    if (state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state("window", {checked: false});
}