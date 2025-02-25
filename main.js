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
        this.registerMarkdownPostProcessor((element) => {
            this.mergeTableCells(element);
        });
    }

    mergeTableCells(element) {
        const tables = element.querySelectorAll('table');
        tables.forEach(table => {
            const rows = Array.from(table.querySelectorAll('tr'));
            rows.forEach((row, rowIndex) => {
                const cells = Array.from(row.querySelectorAll('td, th'));
                cells.forEach((cell, cellIndex) => {
                    if (cell.textContent.trim() === '<') {
                        // 왼쪽 셀과 병합
                        if (cellIndex > 0) {
                            const prevCell = cells[cellIndex - 1];
                            prevCell.colSpan = (prevCell.colSpan || 1) + 1;
                            prevCell.textContent += ' ' + cell.textContent.trim();
                            cell.remove();
                        }
                    } else if (cell.textContent.trim() === '^' && rowIndex > 0) {
                        // 위쪽 셀과 병합
                        const aboveRow = rows[rowIndex - 1];
                        const aboveCell = aboveRow.querySelectorAll('td, th')[cellIndex];
                        if (aboveCell) {
                            aboveCell.rowSpan = (aboveCell.rowSpan || 1) + 1;
                            aboveCell.textContent += ' ' + cell.textContent.trim();
                            cell.remove();
                        }
                    }
                });
            });
        });
    }

    onunload() {
        console.log('All-in-One 플러그인 언로딩 중');
    }
}

module.exports = AllInOnePlugin;
