from PIL import Image
import numpy as np

src = Image.open('logo agencia.jpeg').convert('RGB')
print('original size:', src.size)
arr = np.asarray(src).astype(np.int16)

# Analizar distribución de colores en el recorte del logo
mx = arr.max(axis=2)
ys, xs = np.where(mx > 60)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 20
crop = src.crop((max(0, x0 - pad), max(0, y0 - pad), min(src.width, x1 + pad), min(src.height, y1 + pad)))
carr = np.asarray(crop).astype(np.int16)

# Histograma de intensidades
mx = carr.max(axis=2)
import collections
hist, edges = np.histogram(mx.ravel(), bins=[0, 10, 30, 60, 100, 150, 200, 255])
for i, h in enumerate(hist):
    print(f'intensidad {edges[i]:3d}-{edges[i+1]:3d}: {h} px ({100*h/mx.size:.1f}%)')

# Detectar colores característicos: blanco, negro, rojo
white = (carr.min(axis=2) > 200).sum()
red = ((carr[:, :, 0] > 100) & (carr[:, :, 1] < 120) & (carr[:, :, 2] < 120)).sum()
black = (carr.max(axis=2) < 30).sum()
print(f'white-ish: {white}, red-ish: {red}, black-ish: {black}, total: {mx.size}')

# Zoom en la A (letra izquierda) y en la O
crop_large = crop.resize((crop.width * 2, crop.height * 2), Image.LANCZOS)
crop_large.save('_audit_large.png')

# Zoom en la primera A
a_box = crop.crop((100, 0, 500, 200)).resize((800, 400), Image.LANCZOS)
a_box.save('_audit_a.png')
