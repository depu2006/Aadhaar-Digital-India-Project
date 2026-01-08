import pandas as pd
import re
import json
from pathlib import Path

repo = Path(__file__).parent.parent
csv_path = repo / 'output' / 'admin_decision_dashboard.csv'
out_path = repo / 'frontend' / 'src' / 'data'
out_path.mkdir(parents=True, exist_ok=True)
json_file = out_path / 'district_canonical.json'

if not csv_path.exists():
    print('CSV not found:', csv_path)
    raise SystemExit(1)

_df = pd.read_csv(csv_path)

def norm_state(s):
    if pd.isna(s): return ''
    return ' '.join(str(s).lower().split())

def norm_district(d):
    if pd.isna(d): return ''
    # remove punctuation, lowercase, collapse spaces
    dk = re.sub('[^a-z0-9 ]', ' ', str(d).lower())
    return ' '.join(dk.split()).strip()

counts = {}
for _, r in _df.iterrows():
    st = norm_state(r.get('state',''))
    dk = norm_district(r.get('district',''))
    raw = str(r.get('district','')).strip()
    if not st or not dk: continue
    counts.setdefault(st, {}).setdefault(dk, {}).setdefault(raw, 0)
    counts[st][dk][raw] += 1

# Build preferred mapping: most frequent raw spelling per state+dk
mapping = {}
for st, dkmap in counts.items():
    mapping.setdefault(st, {})
    for dk, rawmap in dkmap.items():
        best_raw = max(rawmap.items(), key=lambda x: x[1])[0]
        mapping[st][dk] = best_raw

with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)

print('Wrote canonical mapping to', json_file)
print('States covered:', len(mapping))
