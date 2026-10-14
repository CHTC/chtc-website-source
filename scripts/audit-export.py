#!/usr/bin/env python3
"""Post-build audits over `out/` (the static export).

  python3 scripts/audit-export.py [out-dir] [--site https://chtc.cs.wisc.edu]

1. Pages missing <meta name=description>, og:image, og:site_name, twitter:card.
2. Canonicals: self-referencing / intentionally external / wrong.
3. Optimized image references (nextImageExportOptimizer/*) with no generated file.
Redirect stubs (meta refresh, noindex) are skipped.
"""
import os, re, sys
from html.parser import HTMLParser

out = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else 'out'
site = 'https://chtc.cs.wisc.edu'
for i, a in enumerate(sys.argv):
    if a == '--site':
        site = sys.argv[i + 1]

class Meta(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta = {}; self.canonical = None; self.robots = None
        self.img = []; self.refresh = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta':
            key = a.get('name') or a.get('property')
            if key: self.meta[key] = a.get('content', '')
            if (a.get('http-equiv') or '').lower() == 'refresh': self.refresh = True
        elif tag == 'link' and a.get('rel') == 'canonical':
            self.canonical = a.get('href')
        elif tag in ('img', 'source'):
            for attr in ('src', 'srcset'):
                v = a.get(attr)
                if v:
                    for part in v.split(','):
                        # srcset entries are "<url> <descriptor>"; the URL may
                        # itself contain spaces, so strip only a trailing
                        # width/density descriptor.
                        self.img.append(re.sub(r'\s+\d+(?:\.\d+)?[wx]$', '', part.strip()))

pages = []
for root, _, files in os.walk(out):
    for f in files:
        if f.endswith('.html'):
            pages.append(os.path.join(root, f))
pages.sort()

missing = {'description': [], 'og:image': [], 'og:site_name': [], 'twitter:card': []}
self_ref, external, wrong = [], [], []
img_missing = set(); img_refs = 0
skipped = 0
for path in pages:
    with open(path, encoding='utf-8', errors='replace') as fh:
        html = fh.read()
    m = Meta(); m.feed(html)
    if m.refresh or (m.meta.get('robots', '') and 'noindex' in m.meta.get('robots', '')):
        skipped += 1
        continue
    rel = os.path.relpath(path, out)
    url = '/' + rel[:-len('index.html')] if rel.endswith('index.html') else '/' + rel
    if url == '/': url = '/'
    for k in missing:
        if not m.meta.get(k): missing[k].append(url)
    c = m.canonical
    if c is None:
        wrong.append((url, None))
    else:
        expected = site.rstrip('/') + url
        if c == expected or c == expected.rstrip('/') and url != '/':
            self_ref.append(url)
        elif not c.startswith(site):
            external.append((url, c))
        else:
            wrong.append((url, c))
    for src in m.img:
        if 'nextImageExportOptimizer' in src:
            img_refs += 1
            local = src.split('?')[0]
            local = local[len(site):] if local.startswith(site) else local
            fs = os.path.join(out, local.lstrip('/'))
            if not os.path.exists(fs):
                img_missing.add(local)

total = len(pages) - skipped
print(f'Audited {total} pages ({skipped} redirect/noindex stubs skipped) in {out}')
print('\n== 1. Missing metadata ==')
for k, v in missing.items():
    print(f'  {k}: {len(v)} of {total}')
    for u in v[:10]: print('     ', u)
print('\n== 2. Canonicals ==')
print(f'  self-referencing: {len(self_ref)}')
print(f'  external:         {len(external)}')
for u, c in external[:10]: print('     ', u, '->', c)
print(f'  WRONG/missing:    {len(wrong)}')
for u, c in wrong[:20]: print('     ', u, '->', c)
print('\n== 3. Optimized image references ==')
print(f'  references: {img_refs}; missing files: {len(img_missing)}')
for u in sorted(img_missing)[:20]: print('     ', u)
sys.exit(1 if (wrong or any(missing.values())) else 0)
