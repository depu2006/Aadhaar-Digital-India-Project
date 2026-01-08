import re
from pathlib import Path

p = Path('data')
if not p.exists():
    print('data directory not found')
    raise SystemExit(1)

pattern = re.compile(r"\band\b", flags=re.IGNORECASE)
changed_files = []
for f in sorted(p.glob('*.csv')):
    text = f.read_text(encoding='utf-8')
    new = pattern.sub('&', text)
    if new != text:
        f.write_text(new, encoding='utf-8')
        changed_files.append(str(f))

if changed_files:
    print('Modified files:')
    for fn in changed_files:
        print('-', fn)
else:
    print('No changes made')
