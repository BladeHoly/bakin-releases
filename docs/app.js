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
    document.getElementById('meta').textContent = `Versión ${version} · Windows 10 y 11 · 64 bits · ${mb} MB · ${date}`;
  }
} catch { /* offline or rate-limited: the static link and line stay */ }
// the button's text never changes; only the line under it appears
document.getElementById('meta').classList.add('ready');
