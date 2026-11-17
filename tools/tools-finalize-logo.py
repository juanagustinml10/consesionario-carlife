from PIL import Image
import numpy as np
import os

src = Image.open('logo agencia.jpeg').convert('RGB')
arr = np.asarray(src).astype(np.int16)
mx = arr.max(axis=2).astype(np.uint8)
ys, xs = np.where(mx > 60)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 24
crop = src.crop((max(0, x0 - pad), max(0, y0 - pad), min(src.width, x1 + pad), min(src.height, y1 + pad)))

# Normalizar negros casi-puro a 0 exacto para fundido perfecto con fondos #000000
carr = np.asarray(crop).astype(np.int16)
m = carr.max(axis=2)
carr[m < 26] = 0
img = Image.fromarray(carr.astype(np.uint8), 'RGB')
out = 'frontend/public/logo/logo-jaymotos-web.jpg'
img.save(out, 'JPEG', quality=90, optimize=True, progressive=True)
print('saved', out, img.size, os.path.getsize(out), 'bytes')

# Limpieza de temporales
for f in [
    'frontend/public/logo/_preview_negro.png',
    'frontend/public/logo/_preview_gris.png',
    'frontend/public/logo/_preview_oscuro.png',
    'frontend/public/logo/_preview_blanco.png',
    'frontend/public/logo/logo-jaymotos.png',
    'frontend/public/logo/logo-jaymotos-negro.jpg',
]:
    if os.path.exists(f):
        os.remove(f)
        print('removed', f)
