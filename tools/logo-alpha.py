from PIL import Image
import numpy as np

img = Image.open('logo agencia.jpeg').convert('RGB')
arr = np.asarray(img).astype(np.int16)
mx = arr.max(axis=2)

# Histograma de los píxeles más oscuros (fondo sospechoso)
dark = mx < 80
print('píxeles < 80:', dark.sum(), 'de', mx.size)
for t in [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60]:
    print(f'  max < {t}:', (mx < t).sum())

# Distribución de valores de blanco (trazo)
bright = mx > 180
print('píxeles > 180:', bright.sum())

# ¿Hay ruido JPEG alto en el fondo? Medir desviación en esquinas
h, w = mx.shape
corners = np.concatenate([mx[:40, :40].ravel(), mx[:40, -40:].ravel(), mx[-40:, :40].ravel(), mx[-40:, -40:].ravel()])
print('esquinas: mean', corners.mean(), 'max', corners.max(), 'min', corners.min())
