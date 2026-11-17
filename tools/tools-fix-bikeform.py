import pathlib
p = pathlib.Path('frontend/src/pages/admin/BikeForm.tsx')
src = p.read_text(encoding='utf-8')
repl = [
    ('rounded-xl border border-white/8 bg-jay-white p-8 shadow-sm', 'rounded-2xl border border-white/8 bg-jay-surface p-8 shadow-card'),
    ('rounded border-jay-black text-jay-red focus:ring-jay-red', 'rounded border-white/20 text-jay-red focus:ring-jay-red bg-transparent'),
    ('border-jay-black/30', 'border-white/15'),
    ('bg-jay-white/90 backdrop-blur', 'bg-black/70 backdrop-blur text-white'),
]
for a, b in repl:
    src = src.replace(a, b)
p.write_text(src, encoding='utf-8')
print('BikeForm done')
