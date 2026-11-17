from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import os

src = Image.open('logo agencia.jpeg').convert('RGB')
arr = np.asarray(src).astype(np.int16)
mx = arr.max(axis=2).astype(np.uint8)

# Crop al contenido
ys, xs = np.where(mx > 60)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 20
crop = src.crop((max(0, x0 - pad), max(0, y0 - pad), min(src.width, x1 + pad), min(src.height, y1 + pad)))
W, H = crop.size
print('crop', crop.size)

# Flood fill desde el borde sobre píxeles casi negros (fondo) con umbral estricto
work = crop.copy()
work_arr = np.asarray(work)
seeds = []
for x in range(W):
    seeds.append((x, 0)); seeds.append((x, H - 1))
for y in range(H):
    seeds.append((0, y)); seeds.append((W - 1, y))
for seed in seeds:
    if int(work_arr.max(axis=2)[seed[1], seed[0]]) < 28:
        ImageDraw.floodfill(work, seed, (255, 255, 255), thresh=28)

bg = np.asarray(work).astype(np.int16)
is_bg = bg.min(axis=2) > 200
print('bg px', is_bg.sum(), 'of', W * H)

# RGB final: letra (no fondo y oscura) -> negro #111111; resto se conserva
carr = np.asarray(crop).astype(np.int16)
mx = carr.max(axis=2).astype(np.int16)
out = carr.copy()
letter = (~is_bg) & (mx < 100)
out[letter] = (17, 17, 17)
print('letter px', letter.sum())

rgba = Image.fromarray(out.astype(np.uint8), 'RGB').convert('RGBA')
a = np.full((H, W), 255, dtype=np.uint8)
a[is_bg] = 0
alpha = Image.fromarray(a, 'L').filter(ImageFilter.GaussianBlur(0.9))
rgba.putalpha(alpha)

outpath = 'frontend/public/logo/logo-jaymotos-transparent.png'
rgba.save(outpath, 'PNG', optimize=True)
print('saved', outpath, os.path.getsize(outpath), 'bytes')

# Previews
for name, bgc in [('negro111', (17, 17, 17, 255)), ('negro000', (0, 0, 0, 255)), ('gris', (128, 128, 128, 255)), ('blanco', (255, 255, 255, 255))]:
    canvas = Image.new('RGBA', (W + 80, H + 80), bgc)
    canvas.paste(rgba, (40, 40), rgba)
    canvas.convert('RGB').save(f'frontend/public/logo/_preview_{name}.png')
print('previews done')
