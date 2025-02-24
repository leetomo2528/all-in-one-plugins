import unified from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

function remarkMergeCells() {
  return (tree) => {
    visit(tree, 'table', (node) => {
      node.children.forEach((row) => {
        let currentCell = null;
        let colspan = 1;
        row.children = row.children.filter((cell) => {
          if (cell.children && cell.children[0] && cell.children[0].value === '>>') {
            colspan++;
            return false;
          } else {
            if (currentCell) {
              currentCell.data = { ...currentCell.data, colspan };
              colspan = 1;
            }
            currentCell = cell;
            return true;
          }
        });
        if (currentCell && colspan > 1) {
          currentCell.data = { ...currentCell.data, colspan };
        }
      });
    });
  };
}

export function parseTable(markdown) {
  const result = unified()
    .use(remarkParse)
    .use(remarkMergeCells)
    .use(remarkStringify)
    .processSync(markdown);

  return result.toString();
}
