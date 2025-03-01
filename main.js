const obsidian = require('obsidian');

class AllInOnePlugin extends obsidian.Plugin {
    async onload() {
        console.log('All-in-One 플러그인 로딩 중');

        // 스타일 추가
        this.addStyle();

        // PDF 추출 기능 추가
        this.addPdfExportCommand();

        // 표 처리 기능 추가
        this.registerMarkdownPostProcessor((element, context) => {
            this.processTable(element);
        });
    }

    addStyle() {
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
    }

    addPdfExportCommand() {
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
    }

    processTable(element) {
        const tables = element.querySelectorAll('table');
        tables.forEach(table => {
            this.mergeCells(table);
            this.processVerticalHeaders(table);
        });
    }

    mergeCells(table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        for (let i = 0; i < rows.length; i++) {
            const cells = Array.from(rows[i].querySelectorAll('td, th'));
            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell.textContent.trim() === '<' && j > 0) {
                    const prevCell = cells[j - 1];
                    prevCell.colSpan = (prevCell.colSpan || 1) + 1;
                    cell.remove();
                } else if (cell.textContent.trim() === '^' && i > 0) {
                    const aboveCell = rows[i - 1].querySelectorAll('td, th')[j];
                    if (aboveCell) {
                        aboveCell.rowSpan = (aboveCell.rowSpan || 1) + 1;
                        cell.remove();
                    }
                }
            }
        }
    }

    processVerticalHeaders(table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        const firstRow = rows[0];
        const cells = Array.from(firstRow.querySelectorAll('td, th'));
        
        cells.forEach((cell, index) => {
            if (cell.textContent.trim() === '-') {
                rows.forEach(row => {
                    const verticalHeader = row.querySelectorAll('td, th')[index];
                    if (verticalHeader) {
                        verticalHeader.style.fontWeight = 'bold';
                    }
                });
            }
        });
    }

    onunload() {
        console.log('All-in-One 플러그인 언로딩 중');
    }
}

module.exports = AllInOnePlugin;
