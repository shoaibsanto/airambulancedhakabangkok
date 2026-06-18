#!/usr/bin/env python3
"""Fix phone masking, /index links, blog/ links, and copyright year."""
import os, glob

def fix_phone_in_file(filepath):
    """Replace masked phone href with correct one using hex to avoid ambiguity."""
    with open(filepath, 'rb') as f:
        data = bytearray(f.read())
    
    # Build the masked pattern: tel:+880****0770 (**** = 4 asterisks = 0x2a x4)
    masked_pattern = b'tel:+880' + b'\x2a\x2a\x2a\x2a' + b'0770'
    # Correct pattern: tel:+8801716960770 (actual digits, not asterisks)
    correct_pattern = b'tel:+880' + b'1716960' + b'0770'
    
    original = bytes(data)
    count = original.count(masked_pattern)
    if count:
        data = bytearray(original.replace(masked_pattern, correct_pattern))
        with open(filepath, 'wb') as f:
            f.write(data)
    return count

def fix_index_links(filepath):
    """Fix href=/index to href=/"""
    with open(filepath, 'r') as f:
        content = f.read()
    count = content.count('href="/index"')
    content = content.replace('href="/index"', 'href="/"')
    with open(filepath, 'w') as f:
        f.write(content)
    return count

def fix_blog_trailing(filepath):
    """Fix href=/blog/ to href=/blog"""
    with open(filepath, 'r') as f:
        content = f.read()
    count = content.count('href="/blog/"')
    content = content.replace('href="/blog/"', 'href="/blog"')
    with open(filepath, 'w') as f:
        f.write(content)
    return count

def fix_copyright(filepath):
    """Fix copyright 2024 to 2026"""
    with open(filepath, 'r') as f:
        content = f.read()
    count = content.count('\u00a9 2024')
    content = content.replace('\u00a9 2024', '\u00a9 2026')
    with open(filepath, 'w') as f:
        f.write(content)
    return count

# Fix lib/site.js first
site_fixed = fix_phone_in_file('lib/site.js')
print(f"lib/site.js: phone fixed ({site_fixed} changes)")

# Fix all HTML content files
html_files = glob.glob('content/*.html') + glob.glob('content/blog/*.html')
total_phone = 0
total_index = 0
total_blog = 0
total_copyright = 0

for f in sorted(html_files):
    name = os.path.basename(f)
    p = fix_phone_in_file(f)
    i = fix_index_links(f)
    b = fix_blog_trailing(f)
    c = fix_copyright(f)
    if p or i or b or c:
        print(f"  {name}: phone={p} index={i} blog/{b} copyright={c}")
    total_phone += p
    total_index += i
    total_blog += b
    total_copyright += c

print(f"\n=== Summary ===")
print(f"Phone fixes: {total_phone}")
print(f"/index fixes: {total_index}")
print(f"/blog/ fixes: {total_blog}")
print(f"Copyright fixes: {total_copyright}")

# Final verification
print("\n=== Verification ===")
for f in html_files + ['lib/site.js']:
    with open(f, 'rb') as fh:
        data = fh.read()
    masked = b'tel:+880' + b'\x2a\x2a\x2a\x2a' + b'0770'
    remaining = data.count(masked)
    if remaining:
        print(f"  ⚠️  {f}: {remaining} masked phones remaining!")

# Verify site.js
with open('lib/site.js') as f:
    s = f.read()
if '1716960770' in s:
    print("  ✅ site.js phone is correct")
print("  Done!")
