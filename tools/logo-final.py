from PIL import Image, ImageFilter
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

mask = mxx < 235
comp, n = ndimage.label(mask, structure=np.ones((3, 3), dtype=np.int32))
print('components:', n)

out = carr.copy()
alpha = np.full((H, W), 255, dtype=np.uint8)   # blanco y rojo = opacos

for i in range(1, n + 1):
    region = (comp == i)
    area = region.sum()
    touches_border = (
        np.any(region[0, :]) or np.any(region[-1, :]) or np.any(region[:, 0]) or np.any(region[:, -1])
    )
    if touches_border:
        # Fondo → transparente
        alpha[region] = 0
        continue
    if area < 5000:
        # Hueco interno (triángulo de la A, círculos de las O) → transparente
        alpha[region] = 0
    else:
        # Cuerpo de letra → negro #111111 semi-transparente
        out[region] = (17, 17, 17)
        alpha[region] = 179

# Suavizar borde de alfa ligeramente
a = Image.fromarray(alpha, 'L').filter(ImageFilter.GaussianBlur(0.6))
rgba = Image.fromarray(out.astype(np.uint8), 'RGB').convert('RGBA')
rgba.putalpha(a)

outpath = 'frontend/public/logo/logo-jaymotos-transparent.png'
rgba.save(outpath, 'PNG', optimize=True)
print('saved', outpath, os.path.getsize(outpath), 'bytes')

for name, bgc in [('negro111', (17, 17, 17, 255)), ('blanco', (255, 255, 255, 255)), ('gris', (128, 128, 128, 255))]:
    canvas = Image.new('RGBA', (W + 80, H + 80), bgc)
    canvas.paste(rgba, (40, 40), rgba)
    canvas.convert('RGB').save(f'_final_{name}.png')
print('previews done')
