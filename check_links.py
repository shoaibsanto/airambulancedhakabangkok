#!/usr/bin/env python3
"""Recheck all inbound links after fixes."""
import re
import os
from collections import defaultdict

CONTENT_DIR = "content"

all_pages = [
    "/", "/services", "/process", "/routes", "/air-ambulance-cost",
    "/icu-vs-medical-escort", "/bangkok-hospitals", "/about", "/faq",
    "/contact", "/blog", "/blog/what-is-an-air-ambulance",
    "/blog/air-ambulance-vs-commercial-medical-flight",
    "/blog/emergency-medical-evacuation-dhaka-to-bangkok",
    "/blog/why-bangladeshi-patients-choose-bangkok",
    "/blog/air-ambulance-for-cardiac-and-critical-patients",
    "/blog/medical-repatriation-to-bangladesh",
    "/blog/air-ambulance-dhaka-bangkok-bumrungrad-cost",
    "/cardiac-emergency-transfer", "/stroke-neurology-evacuation",
    "/cancer-treatment-bangkok", "/trauma-accident-evacuation",
    "/insurance-coverage",
]

all_files = []
for f in os.listdir(CONTENT_DIR):
    if f.endswith('.html') and f != '404.html':
        all_files.append(os.path.join(CONTENT_DIR, f))
for f in os.listdir(os.path.join(CONTENT_DIR, 'blog')):
    if f.endswith('.html'):
        all_files.append(os.path.join(CONTENT_DIR, 'blog', f))

inbound = defaultdict(set)
outbound = defaultdict(set)

for fpath in all_files:
    with open(fpath, 'r') as f:
        content = f.read()
    
    # Get relative path as page URL
    rel = fpath.replace(CONTENT_DIR, '').replace('.html', '').replace('/index', '')
    if rel == '':
        rel = '/'
    elif rel.startswith('/blog/'):
        pass
    elif rel == '/blog':
        rel = '/blog'
    else:
        if not rel.startswith('/'):
            rel = '/' + rel
    
    # Find all internal href links
    hrefs = re.findall(r'href=(["\'])(/[^"\']*?)\1', content)
    for quote, href in hrefs:
        href = href.rstrip('/')
        if href == '':
            href = '/'
        outbound[rel].add(href)
        if href in all_pages:
            inbound[href].add(rel)

print("=" * 60)
print("INBOUND LINK AUDIT")
print("=" * 60)
print(f"{'Page':-<50} {'Links':>5}")
all_ok = True
for page in all_pages:
    count = len(inbound.get(page, set()))
    sources = ", ".join(sorted(inbound.get(page, set()))[:5])
    marker = "✓" if count >= 3 else "⚠️"
    if count < 3:
        all_ok = False
    print(f" {marker} {page:<45} {count:>3}  [{sources}]")

print(f"\nAll pages have 3+ links: {'YES ✓' if all_ok else 'NO - some need fixes'}")

print(f"\n{'='*60}")
print("FILES NEEDING MORE LINKS")
for page in all_pages:
    count = len(inbound.get(page, set()))
    if count < 3:
        print(f"  {page}: {count} links")
