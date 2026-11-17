from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import os

src = Image.open('logo agencia.jpeg').convert('RGB')
arr = np.asarray(src).astype(np.int16)
mx = arr.max(axis=2).astype(np.uint8)

ys, xs = np.where(mx > 60)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 20
crop = src.crop((max(0, x0 - pad), max(0, y0 - pad), min(src.width, x1 + pad), min(src.height, y1 + pad)))
W, H = crop.size
carr = np.asarray(crop).astype(np.int16)
mxx = carr.max(axis=2).astype(np.int16)

# Detectar fondo conectado con centinela
SENTINEL = (255, 0, 255)
work = crop.copy()
work_arr = np.asarray(work)
for x in range(W):
    for seed in [(x, 0), (x, H - 1)]:
        if int(work_arr.max(axis=2)[seed[1], seed[0]]) < 60:
            ImageDraw.floodfill(work, seed, SENTINEL, thresh=60)
for y in range(H):
    for seed in [(0, y), (W - 1, y)]:
        if int(work_arr.max(axis=2)[seed[1], seed[0]]) < 60:
            ImageDraw.floodfill(work, seed, SENTINEL, thresh=60)

bg = np.asarray(work).astype(np.int16)
is_bg = (np.abs(bg - np.array(SENTINEL, dtype=np.int16)).max(axis=2) < 80)

# Relleno de letras: OSCURO y no fondo -> negro #111111 con alpha medio
out = carr.copy()
letter = (~is_bg) & (mxx < 90)
out[letter] = (17, 17, 17)

a = np.full((H, W), 255, dtype=np.uint8)   # trazo blanco y rojo: opacos
a[is_bg] = 0                                # fondo: transparente
a[letter] = 179                             # relleno NEGRO MEDIO TRANSPARENTE (70%)
alpha = Image.fromarray(a, 'L').filter(ImageFilter.GaussianBlur(0.6))
rgba = Image.fromarray(out.astype(np.uint8), 'RGB').convert('RGBA')
rgba.putalpha(alpha)

outpath = 'frontend/public/logo/logo-jaymotos-transparent.png'
rgba.save(outpath, 'PNG', optimize=True)
print('saved', outpath, os.path.getsize(outpath), 'bytes')

# Previews: oscuro y claro para comparar
for name, bgc in [('negro111', (17, 17, 17, 255)), ('gris', (128, 128, 128, 255)), ('blanco', (255, 255, 255, 255)), ('oscuro2', (34, 34, 34, 255))]:
    canvas = Image.new('RGBA', (W + 80, H + 80), bgc)
    canvas.paste(rgba, (40, 40), rgba)
    canvas.convert('RGB').save(f'_semi_{name}.png')
print('previews done')
