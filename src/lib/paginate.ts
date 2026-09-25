import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface PaginationConfig {
  max_columns_per_page: number;
  max_paragraphs_per_column: number;
  max_chars_per_column: number;
}

export interface Column {
  paragraphs: string[];
}

export interface Page {
  columns: Column[];
}

export interface Spread {
  left: Page;
  right: Page;
}

export interface DiaryData {
  title: string;
  pagination: PaginationConfig;
  sections: string[][];
}

const DEFAULT_CONFIG: PaginationConfig = {
  max_columns_per_page: 4,
  max_paragraphs_per_column: 5,
  max_chars_per_column: 140,
};

export function loadDiaryData(rootDir: string): DiaryData {
  const filePath = path.join(rootDir, 'src/data/diary.md');
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  const metadata = match ? (yaml.load(match[1]) as Partial<DiaryData>) : {};
  const body = match ? match[2] : raw;
  const sections: string[][] = body
    .split(/\r?\n[\t \u3000]*\r?\n+/)
    .map((section: string) =>
      section
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0),
    )
    .filter((section: string[]) => section.length > 0);

  return {
    title: metadata.title ?? 'ルーデウスの日記',
    pagination: { ...DEFAULT_CONFIG, ...metadata.pagination },
    sections,
  };
}
