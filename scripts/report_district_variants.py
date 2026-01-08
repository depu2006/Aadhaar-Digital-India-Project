import pandas as pd
import re
from pathlib import Path
p = Path(__file__).parent.parent / 'output' / 'admin_decision_dashboard.csv'
if not p.exists():
    print('ERROR: file not found:', p)
    raise SystemExit(1)

df = pd.read_csv(p)

def norm_state(s):
    if pd.isna(s): return ''
    return ' '.join(str(s).lower().split())

def norm_district(d):
    if pd.isna(d): return ''
    return re.sub('[^a-z0-9 ]',' ', str(d).lower()).split()

dist_map = {}
for _, r in df.iterrows():
    st = norm_state(r.get('state',''))
    dt_words = norm_district(r.get('district',''))
    if not st or not dt_words: continue
    dk = ' '.join(dt_words)
    key = (st, dk)
    dist_map.setdefault(key, set()).add(str(r.get('district','')))

problems = [(k,v) for k,v in dist_map.items() if len(v) > 1]
problems.sort()
print('Total groups with multiple district spellings:', len(problems))
for st_dk, variants in problems[:200]:
    st, dk = st_dk
    print('\n---')
    print('state_norm:', st)
    print('district_norm:', dk)
    print('raw variants:')
    for v in sorted(variants):
        print('  -', v)