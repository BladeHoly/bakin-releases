// The download button points at the newest installer, asked to GitHub on
// every visit: a new release needs no change here. Without an answer the
// button keeps its link to the releases page.
import { tokensToCss } from '@glass-midas/core';
import './vendor/glass-midas/components/index.js';

document.head.insertAdjacentHTML('beforeend', `<style>${tokensToCss()}</style>`);

const API = 'https://api.github.com/repos/BladeHoly/bakin-releases/releases/latest';

try {
  const rel = await (await fetch(API, { headers: { Accept: 'application/vnd.github+json' } })).json();
  const exe = rel.assets?.find((a) => a.name.endsWith('-setup.exe'));
  if (exe) {
    const version = rel.tag_name.replace(/^v/, '');
    const mb = Math.round(exe.size / 1048576);
    const date = new Date(rel.published_at).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
    const link = document.getElementById('dl');
    link.href = exe.browser_download_url;
    link.querySelector('span').textContent = `Descargar Bakin ${version}`;
    document.getElementById('meta').textContent = `Windows 10 y 11 · 64 bits · ${mb} MB · ${date}`;
  }
  // the release notes: the «- » lines of this version
  const items = String(rel.body || '').split(/\r?\n/).filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
  if (items.length) {
    document.getElementById('notes-version').textContent = rel.tag_name;
    document.getElementById('notes').replaceChildren(...items.map((t) => Object.assign(document.createElement('li'), { textContent: t })));
  }
} catch { /* offline or rate-limited: the static link stays */ }
