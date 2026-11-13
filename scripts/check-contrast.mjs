// WCAG AA contrast check for the design tokens in src/css/input.css
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/css/input.css', import.meta.url), 'utf8');
const block = (re) => Object.fromEntries([...css.match(re)[1].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\b/gi)].map((m) => [m[1], m[2]]));
const themes = { light: block(/:root\s*{([^}]*)}/), dark: block(/\[data-theme="dark"\]\s*{([^}]*)}/) };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const pairs = [
  ['text', 'bg'], ['text', 'surface'], ['text', 'surface-2'], ['muted', 'bg'], ['muted', 'surface'], ['muted', 'surface-2'],
  ['on-primary', 'primary'], ['on-secondary', 'secondary'], ['on-accent', 'accent'],
  ['link', 'bg'], ['link', 'surface'], ['secondary', 'bg'], ['secondary', 'surface'], ['primary', 'bg'],
  ['footer-text', 'footer-bg'], ['footer-muted', 'footer-bg'], ['accent', 'footer-bg'], ['focus', 'bg'],
];
let fail = 0;
for (const [name, t] of Object.entries(themes)) {
  for (const [fg, bg] of pairs) {
    const r = ratio(t[fg], t[bg]);
    const ok = r >= 4.5;
    if (!ok) fail++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(5)} ${fg} on ${bg}: ${r.toFixed(2)}`);
  }
}
process.exit(fail ? 1 : 0);
