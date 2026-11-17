from PIL import Image
import numpy as np
from collections import deque

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

# Máscara de "no blanco" (todo lo que no es trazo blanco)
mask = mxx < 235
labels = np.full((H, W), -1, dtype=np.int32)
cur = 0
stack = []

# Etiquetado por componentes conectadas
from scipy import ndimage
try:
    structure = np.ones((3, 3), dtype=np.int32)
    comp, n = ndimage.label(mask, structure=structure)
    sizes = ndimage.sum(np.ones_like(comp), comp, range(1, n + 1)).astype(np.int64)
    print('components:', n)
    order = np.argsort(-sizes)
    for i in order[:20]:
        comp_id = i + 1
        area = sizes[comp_id - 1 + 0]
        touches_border = False
        ys2, xs2 = np.where(comp == comp_id)
        if ys2.min() == 0 or xs2.min() == 0 or ys2.max() == H - 1 or xs2.max() == W - 1:
            touches_border = True
        print(f'comp {comp_id}: area={area:6d} bbox=({xs2.min()},{ys2.min()}-{xs2.max()},{ys2.max()}) border={touches_border}')
except Exception as e:
    print('scipy failed:', e)
