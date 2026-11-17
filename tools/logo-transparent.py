from PIL import Image
import numpy as np
import os

img = Image.open('logo agencia.jpeg').convert('RGB')
arr = np.asarray(img).astype(np.int16)
mx = arr.max(axis=2).astype(np.uint8)

# Recortar al contenido (como antes)
ys, xs = np.where(mx > 60)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 20
crop = img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))
W, H = crop.size
print('crop size', crop.size)

carr = np.asarray(crop).astype(np.int16)
mx = carr.max(axis=2).astype(np.float32)

# Rampa de alfa: negro profundo -> transparente, trazo brillante -> opaco
alpha = np.clip((mx - 16.0) / (54.0 - 16.0), 0.0, 1.0)
# Suavizar la transición (smoothstep)
alpha = alpha * alpha * (3 - 2 * alpha)
a = np.clip(alpha * 255, 0, 255).astype(np.uint8)
rgba = crop.convert('RGBA')
rgba.putalpha(Image.fromarray(a, 'L'))
out = 'frontend/public/logo/logo-jaymotos-transparent.png'
os.makedirs('frontend/public/logo', exist_ok=True)
rgba.save(out, 'PNG', optimize=True)
print('saved', out, os.path.getsize(out), 'bytes')

# Previews compuestos
for name, bgc in [('negro111', (17, 17, 17, 255)), ('gris', (128, 128, 128, 255)), ('blanco', (255, 255, 255, 255))]:
    canvas = Image.new('RGBA', (W + 80, H + 80), bgc)
    canvas.paste(rgba, (40, 40), rgba)
    canvas.convert('RGB').save(f'frontend/public/logo/_tp_{name}.png')
print('previews done')
