from PIL import Image, ImageDraw
import numpy as np

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

# Mapa de auditoría: fondo = negro transparente marcado gris
# Relleno actual = rellenado con #111111 -> marcar MAGENTA
audit = carr.copy()
fill = (~is_bg) & (mxx < 100)
audit[fill] = (255, 0, 255)

# Huecos internos (contrastas): A, O, O -> marcar CYAN (subconjunto de fill)
# Los huecos internos son fill con mx < 25 (negro profundo)
audit[fill & (mxx < 25)] = (0, 255, 255)

Image.fromarray(audit.astype(np.uint8), 'RGB').save('_audit_map.png')
print('audit map saved')
print('fondo (transparente):', is_bg.sum(), 'px')
print('relleno #111111:', fill.sum(), 'px')
print('de los cuales oscuro profundo (<25):', (fill & (mxx < 25)).sum(), 'px')
print('letras body (25-100):', (fill & (mxx >= 25) & (mxx < 100)).sum(), 'px')
