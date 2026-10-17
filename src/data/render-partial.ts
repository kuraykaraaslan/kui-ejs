import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

/** Renders a repo partial (path relative to the repo root) for a showcase preview. */
export function renderPartial(relPath: string, locals: Record<string, unknown> = {}): string {
  const file = path.join(process.cwd(), relPath);
  return ejs.render(fs.readFileSync(file, 'utf-8'), locals, { filename: file });
}
