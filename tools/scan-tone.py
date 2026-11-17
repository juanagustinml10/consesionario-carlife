import os, re
patterns = [r'9:00', r'19:00', r'Libertador', r'200\+', r'10\+', r'12\+', r'años', r'hace \d', r'certificad', r'garant', r'financi', r'entregadas', r'Sáb']
for root, dirs, files in os.walk('src'):
    if 'node_modules' in root:
        continue
    for f in files:
        if not f.endswith(('.tsx', '.ts', '.css', '.html')):
            continue
        p = os.path.join(root, f)
        for i, line in enumerate(open(p, encoding='utf-8'), 1):
            for pat in patterns:
                if re.search(pat, line, re.IGNORECASE):
                    print(f'{p}:{i}: {line.rstrip()[:160]}')
                    break
