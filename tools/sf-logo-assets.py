"""Genera los assets del logotipo de SF MOTOS a partir del JPEG oficial.

No redibuja el logo: sólo extrae la silueta original con canal alfa y la
representa en negro (fondos claros) o blanco (fondos oscuros), conservando
proporciones, trazos y el tagline original.

Uso: py tools/sf-logo-assets.py
"""

from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "LOGO SF MOTOS - copia.jpeg"
OUT_DIR = ROOT / "frontend" / "public" / "logo"
FAVICON = ROOT / "frontend" / "public" / "favicon.png"

# El JPEG tiene fondo gris claro (~247) y trazo negro (~0). Se calcula una
# máscara de cobertura para conservar el antialiasing original.
BACKGROUND = 247.0
CUTOFF = 238.0


def alpha_mask(gray: np.ndarray) -> np.ndarray:
    values = gray.astype(np.float32)
    alpha = (BACKGROUND - values) / BACKGROUND
    alpha = np.clip(alpha, 0.0, 1.0)
    alpha[values >= CUTOFF] = 0.0
    alpha[alpha < 0.04] = 0.0
    return np.rint(alpha * 255).astype(np.uint8)


def tinted(mask: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    out = Image.new("RGBA", mask.size, (*rgb, 0))
    out.putalpha(mask)
    return out


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("L")
    arr = np.asarray(source)
    ys, xs = np.where(arr < 180)
    pad = 18
    box = (
        max(0, int(xs.min()) - pad),
        max(0, int(ys.min()) - pad),
        min(source.width, int(xs.max()) + pad + 1),
        min(source.height, int(ys.max()) + pad + 1),
    )
    cropped = source.crop(box)
    mask = Image.fromarray(alpha_mask(np.asarray(cropped)), "L")

    black = tinted(mask, (10, 10, 10))
    white = tinted(mask, (255, 255, 255))
    black.save(OUT_DIR / "sf-motos-black.png", optimize=True)
    white.save(OUT_DIR / "sf-motos-white.png", optimize=True)

    # Isotipo recortado del monograma original (sin reescalar el arte).
    icon_mask = mask.crop((0, 0, mask.width, 186))
    # Centrar en un lienzo cuadrado para favicon/Mark.
    size = max(icon_mask.size)
    icon = Image.new("L", (size, size), 0)
    icon.paste(icon_mask, ((size - icon_mask.width) // 2, (size - icon_mask.height) // 2))
    tinted(icon, (10, 10, 10)).resize((512, 512), Image.LANCZOS).save(FAVICON, optimize=True)
    tinted(icon, (10, 10, 10)).save(OUT_DIR / "sf-motos-icon.png", optimize=True)
    tinted(icon, (255, 255, 255)).save(OUT_DIR / "sf-motos-icon-white.png", optimize=True)

    print(f"logo box: {box} -> {cropped.size}")
    print(f"assets: {OUT_DIR}, {FAVICON}")


if __name__ == "__main__":
    main()
