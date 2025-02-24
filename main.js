const obsidian = require('obsidian');

class AllInOnePlugin extends obsidian.Plugin {
    async onload() {
        console.log('All-in-One 플러그인 로딩 중');

        // 스타일 추가
        this.registerMarkdownPostProcessor((element) => {
            element.classList.add('all-in-one-plugin-styles');
        });

        document.body.appendChild(createEl('style', {
            text: `
                .all-in-one-plugin-styles .markdown-source-view .cm-line,
                .all-in-one-plugin-styles .markdown-preview-view p {
                    white-space: nowrap;
                    overflow-x: auto;
                }
            `
        }));

        // PDF 추출 기능 추가
        this.addCommand({
            id: 'export-to-pdf',
            name: 'PDF로 내보내기',
            callback: async () => {
                const activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                if (activeView) {
                    const content = activeView.getViewData();
                    console.log('PDF로 내보내는 중:', content);
                    // 여기에 실제 PDF 내보내기 로직을 구현해야 합니다.
                }
            }
        });

        // 표 셀 병합 기능 추가
        this.registerMarkdownPostProcessor((element, context) => {
            const tables = element.querySelectorAll('table');
            tables.forEach(table => {
                this.processTable(table);
            });
        });
    }

    processTable(table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td, th');
            let currentCell = null;
            let colspan = 1;
            cells.forEach((cell, index) => {
                if (cell.textContent.trim() === '>>') {
                    colspan++;
                    cell.remove();
                } else {
                    if (currentCell) {
                        currentCell.setAttribute('colspan', colspan);
                        colspan = 1;
                    }
                    currentCell = cell;
                }
            });
            if (currentCell && colspan > 1) {
                currentCell.setAttribute('colspan', colspan);
            }
        });
    }

    onunload() {
        console.log('All-in-One 플러그인 언로딩 중');
    }
}

module.exports = AllInOnePlugin;
