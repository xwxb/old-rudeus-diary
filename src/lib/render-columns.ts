import type { Column, Page } from './paginate';

function renderColumn(column: Column, nearSpine = false): string {
  const spineClass = nearSpine ? ' column-slot--spine' : '';
  const paragraphs = column.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n');

  return `
    <div class="column-slot${spineClass}">
      <div class="vertical-rl ink-text">
        ${paragraphs}
      </div>
    </div>
  `.trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderPageHtml(page: Page, side: 'left' | 'right'): string {
  if (page.columns.length === 0) return '';

  const parts: string[] = [];

  page.columns.forEach((column, index) => {
    const nearSpine =
      side === 'right' ? index === page.columns.length - 1 : index === 0;

    parts.push(renderColumn(column, nearSpine));

    if (index < page.columns.length - 1) {
      parts.push('<div class="column-divider"></div>');
    }
  });

  return parts.join('\n');
}
