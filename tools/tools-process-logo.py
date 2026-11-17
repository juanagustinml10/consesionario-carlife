from PIL import Image, ImageDraw
import numpy as np
import os

img = Image.open('logo agencia.jpeg').convert('RGB')
arr = np.asarray(img).astype(np.int16)
mx = arr.max(axis=2).astype(np.uint8)

ys, xs = np.where(mx > 60)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 24
crop = img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))
print('crop size', crop.size)
W, H = crop.size

# Flood fill desde bordes con umbral estricto: solo fondo casi puro
thr = 45
work = crop.copy()
work_arr = np.asarray(work)
seeds = []
for x in range(W):
    seeds.append((x, 0)); seeds.append((x, H - 1))
for y in range(H):
    seeds.append((0, y)); seeds.append((W - 1, y))
for seed in seeds:
    if int(work_arr.max(axis=2)[seed[1], seed[0]]) < thr:
        ImageDraw.floodfill(work, seed, (255, 255, 255), thresh=thr)

bg = np.asarray(work).astype(np.int16)
is_bg = bg.min(axis=2) > 200
print('bg px', is_bg.sum(), 'of', W * H)

rgba = crop.convert('RGBA')
a = np.full((H, W), 255, dtype=np.uint8)
a[is_bg] = 0
rgba.putalpha(Image.fromarray(a, 'L'))
out = 'frontend/public/logo/logo-jaymotos.png'
rgba.save(out, 'PNG', optimize=True)
print('saved', out, os.path.getsize(out), 'bytes')

# Previews
for name, bgc in [('negro', (0, 0, 0, 255)), ('gris', (128, 128, 128, 255)), ('oscuro', (17, 17, 17, 255))]:
    canvas = Image.new('RGBA', (W + 80, H + 80), bgc)
    canvas.paste(rgba, (40, 40), rgba)
    canvas.convert('RGB').save(f'frontend/public/logo/_preview_{name}.png')
print('previews done')
