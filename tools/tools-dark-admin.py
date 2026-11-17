import re, pathlib

# bg-jay-black/5 -> quitar (admin ya es negro)
replacements = [
    ('bg-jay-black/5', 'bg-transparent'),
    ('bg-jay-black/3', 'bg-white/[0.02]'),
    ('bg-jay-black/10', 'bg-white/[0.04]'),
    ('rounded-xl border border-jay-black/10 bg-jay-white shadow-sm', 'rounded-2xl border border-white/8 bg-jay-surface shadow-card'),
    ('border-jay-black/5 bg-jay-black/5', 'border-white/5 bg-jay-elevated/60'),
    ('rounded-xl border border-jay-black/10 bg-jay-white p-6 shadow-2xl', 'rounded-2xl border border-white/10 bg-jay-surface p-6 shadow-2xl'),
    ('border-jay-black/20 bg-jay-white', 'border-white/10 bg-jay-elevated text-white'),
    ('divide-jay-black/5', 'divide-white/5'),
    ('hover:bg-jay-black/3', 'hover:bg-white/[0.04]'),
    ('hover:bg-jay-black/5', 'hover:bg-white/5'),
    ('hover:bg-jay-black/10', 'hover:bg-white/10'),
    ('text-jay-black/70', 'text-gray-300'),
    ('text-jay-black/60', 'text-gray-400'),
    ('text-jay-black/50', 'text-gray-500'),
    ('text-jay-black/40', 'text-gray-500'),
    ('text-jay-black', 'text-white'),
    ('border-jay-black/10', 'border-white/8'),
    ('border-jay-black/20', 'border-white/10'),
    ('border-jay-black/5', 'border-white/5'),
    ('focus:ring-jay-red/50', 'focus:ring-jay-red/40'),
]

files = [
    'frontend/src/pages/admin/Bikes.tsx',
    'frontend/src/pages/admin/BikeForm.tsx',
    'frontend/src/pages/admin/Dashboard.tsx',
    'frontend/src/pages/admin/Login.tsx',
]
for rel in files:
    p = pathlib.Path(rel)
    src = p.read_text(encoding='utf-8')
    for a, b in replacements:
        src = src.replace(a, b)
    p.write_text(src, encoding='utf-8')
    print('processed', rel)
