from PIL import Image
import numpy as np

raw = np.asarray(Image.open('frontend/public/logo/_raw_crop.png').convert('RGB')).astype(np.int16)
out = np.asarray(Image.open('frontend/public/logo/logo-jaymotos-transparent.png').convert('RGBA'))
print('raw shape', raw.shape, 'out shape', out.shape)

# Blanco típico del trazo en la imagen cruda: buscar píxeles claros
mask = raw.max(axis=2) > 150
ys, xs = np.where(mask)
print('px blancos en raw:', mask.sum())
for i in [0, len(ys)//2, len(ys)-1]:
    y, x = ys[i], xs[i]
    print('raw', (y, x), raw[y, x], '-> out RGB', out[y, x, :3], 'A', out[y, x, 3])

# Distribución de alpha
a = out[..., 3]
print('alpha=0:', (a == 0).sum(), 'alpha=255:', (a == 255).sum(), 'resto:', ((a > 0) & (a < 255)).sum())

# Verificar un punto del fondo
print('corner out', out[0, 0], 'alpha', out[0, 0, 3])
