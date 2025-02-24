import { Plugin } from 'obsidian';
import { exportToPDF } from './pdfExport.mjs';
import { parseTable } from './tableParser.mjs';

export default class AllInOnePlugin extends Plugin {
  async onload() {
    console.log('Loading All-in-One Plugins');

    // PDF 추출 기능 추가
    this.addCommand({
      id: 'export-to-pdf',
      name: 'Export to PDF',
      callback: async () => {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (activeView) {
          const content = activeView.getViewData();
          const pdfBytes = await exportToPDF(content);
          // PDF 저장 로직 구현
        }
      }
    });

    // 표 셀 병합 기능 추가
    this.registerMarkdownPostProcessor((element, context) => {
      const tables = element.querySelectorAll('table');
      tables.forEach(table => {
        const markdown = table.outerHTML;
        const parsedMarkdown = parseTable(markdown);
        const newTable = this.createElementFromHTML(parsedMarkdown);
        table.replaceWith(newTable);
      });
    });
  }

  createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  onunload() {
    console.log('Unloading All-in-One Plugins');
  }
}
