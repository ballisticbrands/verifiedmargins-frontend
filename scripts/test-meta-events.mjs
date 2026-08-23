/* Unit test for the Meta standard-event rewrite (src/lib/meta-events.ts).
 *
 * This is the only automated check that the CompleteRegistration fix is intact.
 * Everything else about it is invisible: the wire format for track and
 * trackCustom is identical, so no network assertion can tell them apart —
 * Meta classifies server-side by which method was called. Without this test the
 * shim can be deleted or broken and nothing fails until someone reads Events
 * Manager and notices CompleteRegistration filed as a custom event.
 *
 * Runs the TypeScript through a trivial strip since the rewrite is pure and has
 * no imports. Usage: node scripts/test-meta-events.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'src/lib/meta-events.ts'), 'utf8');

// Pull out just the pure parts: the Set and the rewrite. No TS transform needed
// beyond dropping the type annotations on the one exported signature.
const setSrc = src.match(/export const META_STANDARD_EVENTS = new Set\(\[[\s\S]*?\]\);/)[0]
  .replace('export ', '');
const fnSrc = src.match(/export function rewriteMetaArgs[\s\S]*?\n}/)[0]
  .replace('export ', '')
  .replace('(args: unknown[]): unknown[]', '(args)');
const { rewriteMetaArgs } = await import(
  'data:text/javascript,' + encodeURIComponent(`${setSrc}\n${fnSrc}\nexport { rewriteMetaArgs };`)
);

let fail = 0;
const eq = (label, got, want) => {
  const a = JSON.stringify(got), b = JSON.stringify(want);
  if (a === b) console.log(`  ✅ ${label}`);
  else { console.log(`  ❌ ${label}\n       got  ${a}\n       want ${b}`); fail++; }
};

console.log('\nmeta-events — standard-event rewrite\n');

// The bug this module exists for.
eq('CompleteRegistration: trackCustom → track',
   rewriteMetaArgs(['trackCustom', 'CompleteRegistration', { external_id: 'u1' }]),
   ['track', 'CompleteRegistration', { external_id: 'u1' }]);

// Other standard events the shared lib or LP may send.
for (const ev of ['InitiateCheckout', 'ViewContent', 'Lead', 'Purchase', 'Subscribe']) {
  eq(`${ev}: trackCustom → track`,
     rewriteMetaArgs(['trackCustom', ev]), ['track', ev]);
}

// 🚨 Over-reach is the failure mode that would be worse than the bug: renaming
// a genuinely custom event to `track` sends Meta an event it does not know.
eq('a genuinely custom event is left alone',
   rewriteMetaArgs(['trackCustom', 'ConnectSeller', { x: 1 }]),
   ['trackCustom', 'ConnectSeller', { x: 1 }]);
eq('ConnectAds is left alone',
   rewriteMetaArgs(['trackCustom', 'ConnectAds']), ['trackCustom', 'ConnectAds']);

// Non-trackCustom calls must pass through untouched.
eq('track passes through', rewriteMetaArgs(['track', 'PageView']), ['track', 'PageView']);
eq('init passes through', rewriteMetaArgs(['init', '4044834252476491']), ['init', '4044834252476491']);
eq('set passes through', rewriteMetaArgs(['set', 'agent', 'x']), ['set', 'agent', 'x']);

// Defensive: malformed calls must not throw.
eq('no event name', rewriteMetaArgs(['trackCustom']), ['trackCustom']);
eq('non-string event name', rewriteMetaArgs(['trackCustom', 42]), ['trackCustom', 42]);
eq('case-sensitive — completeregistration is NOT standard',
   rewriteMetaArgs(['trackCustom', 'completeregistration']),
   ['trackCustom', 'completeregistration']);

console.log(`\n${fail} failing\n`);
process.exit(fail);
