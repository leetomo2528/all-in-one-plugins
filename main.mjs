const obsidian = require('obsidian');

class AllInOnePlugin extends obsidian.Plugin {
    async onload() {
        console.log('Loading All-in-One Plugins');

        // PDF 추출 기능 추가
        this.addCommand({
            id: 'export-to-pdf',
            name: 'Export to PDF',
            callback: async () => {
                const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                if (activeView) {
                    const content = activeView.getViewData();
                    // PDF 추출 로직 구현
                    console.log('Exporting to PDF:', content);
                }
            }
        });

        // 표 셀 병합 기능 추가
        this.registerMarkdownPostProcessor((element, context) => {
            const tables = element.querySelectorAll('table');
            tables.forEach(table => {
                // 표 셀 병합 로직 구현
                console.log('Processing table:', table);
            });
        });
    }

    onunload() {
        console.log('Unloading All-in-One Plugins');
    }
}

module.exports = AllInOnePlugin;
