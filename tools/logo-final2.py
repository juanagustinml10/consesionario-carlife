from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import os
from scipy import ndimage

src = Image.open('logo agencia.jpeg').convert('RGB')
arr = np.asarray(src).astype(np.int16)
mx = arr.max(axis=2).astype(np.uint8)

ys, xs = np.where(mx > 60)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 20
crop = src.crop((max(0, x0 - pad), max(0, y0 - pad), min(src.width, x1 + pad), min(src.height, y1 + pad)))
W, H = crop.size
carr = np.asarray(crop).astype(np.int16)
mxx = carr.max(axis=2)

# 1) Fondo conectado desde el borde (solo negro profundo) — swash rojo intacto
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

# 2) Islas oscuras restantes (cuerpo de letras + huecos internos)
islands = (~is_bg) & (mxx < 80)
comp, n = ndimage.label(islands, structure=np.ones((3, 3), dtype=np.int32))
print('dark islands:', n)

out = carr.copy()
alpha = np.full((H, W), 255, dtype=np.uint8)

ALPHA_BG = 0
ALPHA_BODY = 179
ALPHA_COUNTER = 0
DARK_CUTOFF = 80

for i in range(1, n + 1):
    region = (comp == i)
    area = int(region.sum())
    if area > 5000:
        out[region] = (17, 17, 17)   # #111111 - cuerpo de letra
        alpha[region] = ALPHA_BODY
    else:
        alpha[region] = ALPHA_COUNTER # huecos internos → transparentes

# 3) El fondo (no conectado pero en la máscara dark) → transparente
alpha[is_bg] = ALPHA_BG

a = Image.fromarray(alpha, 'L').filter(ImageFilter.GaussianBlur(0.6))
rgba = Image.fromarray(out.astype(np.uint8), 'RGB').convert('RGBA')
rgba.putalpha(a)

outpath = 'frontend/public/logo/logo-jaymotos-transparent.png'
rgba.save(outpath, 'PNG', optimize=True)
print('saved', outpath, os.path.getsize(outpath), 'bytes')

for name, bgc in [('negro111', (17, 17, 17, 255)), ('blanco', (255, 255, 255, 255)), ('gris', (128, 128, 128, 255))]:
    canvas = Image.new('RGBA', (W + 80, H + 80), bgc)
    canvas.paste(rgba, (40, 40), rgba)
    canvas.convert('RGB').save(f'_final2_{name}.png')
print('previews done')
