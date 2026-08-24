/* The .ts module the app renders from and the .mjs twin the build scripts read
 * must agree. If they drift, the page says one URL and its own canonical says
 * another — the kind of split that is invisible until a crawler acts on it. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pick = (src, name) => (src.match(new RegExp(`${name} = ["']([^"']+)["']`)) ?? [])[1];
const ts = readFileSync(join(root, 'src/data/site.ts'), 'utf8');
const mjs = readFileSync(join(root, 'src/data/site.mjs'), 'utf8');

const bad = ['SITE', 'API_BASE', 'BRAND_NAME'].filter((k) => pick(ts, k) !== pick(mjs, k));
if (bad.length) {
  console.error(`check-site-constants: site.ts and site.mjs disagree on ${bad.join(', ')}`);
  process.exit(1);
}
console.log('check-site-constants: ok');
