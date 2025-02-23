const obsidian = require("obsidian");
module.exports = class AllInOnePlugin extends obsidian.Plugin {
    async onload() {
        console.log("All in One Plugins loaded");
        // 여기에 플러그인 기능을 구현합니다
    }

    onunload() {
        console.log("All in One Plugins unloaded");
    }
}
