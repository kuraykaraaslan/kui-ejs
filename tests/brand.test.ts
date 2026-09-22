import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ARMS, FORK, STROKE_WIDTH } from '../brand/geometry.mjs';

const ROOT = path.resolve(__dirname, '..');
const read = (rel: string) => readFileSync(path.join(ROOT, rel), 'utf8');

// Brand_Positioning_Rules/logo-system.md
describe('brand mark', () => {
  it('forks both arms at exactly 45 degrees (dx === dy)', () => {
    for (const tip of ARMS) expect(Math.abs(tip.x - FORK.x)).toBe(Math.abs(tip.y - FORK.y));
  });

  it('the in-app partial is current and colors from theme tokens only', () => {
    const partial = read('views/partials/_brand-mark.ejs');
    for (const tip of ARMS) expect(partial).toContain(`M${FORK.x} ${FORK.y} L${tip.x} ${tip.y}`);
    expect(partial).toContain(`stroke-width="${STROKE_WIDTH}"`);
    expect(partial).toContain('var(--brand-tone-two)');
    expect(partial).not.toMatch(/#[0-9a-f]{3,8}/i);
  });

  it('the showcase chrome uses the mark, not a letter tile', () => {
    expect(read('views/partials/_navbar.ejs')).toContain('_brand-mark');
    expect(read('views/showcase/partials/home-panel.ejs')).toContain('_brand-mark');
  });
});
