var {ToggleButton} = require("sdk/ui/button/toggle");
var panels = require("sdk/panel");
var self = require("sdk/self");

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
    width: 180,
    height: 300,
    contentURL: self.data.url("panel.html"),
    onHide: handleHide
});

function handleChange (state) {
    console.log(state.label + " checked state: " + state.checked);
    if (state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state("window", {checked: false});
}
