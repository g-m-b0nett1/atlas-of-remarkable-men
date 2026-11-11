#!/usr/bin/env python3
"""Build atlas-of-remarkable-men.html: index.html with the local scripts inlined."""
import re
from pathlib import Path

here = Path(__file__).parent
page = (here / 'index.html').read_text(encoding='utf-8')

def inline(m):
    src = m.group(1)
    if src.startswith('http'):
        return m.group(0)  # leave CDN scripts alone
    js = (here / src).read_text(encoding='utf-8')
    return '<script>' + js.replace('</script', '<\\/script') + '</script>'

page = re.sub(r'<script src="([^"]+)"></script>', inline, page)
out = here / 'atlas-of-remarkable-men.html'
out.write_text(page, encoding='utf-8')
print(f'{out.name}: {out.stat().st_size / 1e6:.1f} MB')
