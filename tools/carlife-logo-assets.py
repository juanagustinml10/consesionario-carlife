"""Genera los recursos web del logotipo de CARLIFE.

La fuente es siempre `LOGO CARLIFE.jpeg` (JPEG sobre fondo negro). El trazo se
respeta: no se redibuja ni se sustituye por texto. Se calcula una máscara de
alfa a partir de la luminancia para CAR y a partir de la dominancia roja para
LIFE, y se componen en el wordmark completo con la paleta oficial
(blanco, rojo, negro).

Salidas en `frontend/public/logo/` y `frontend/public/favicon.png`.
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "LOGO CARLIFE.jpeg"
OUTPUT = ROOT / "frontend" / "public" / "logo"
FAVICON = ROOT / "frontend" / "public" / "favicon.png"

# Paleta oficial CARLIFE.
BLACK = (10, 10, 10)  # #0A0A0A
RED = (233, 19, 17)  # #E91311 (rojo del logotipo original)
WHITE = (255, 255, 255)  # #FFFFFF

# Recortes medidos sobre el JPEG original (1200 x 896).
WORDMARK_BOX = (108, 324, 576, 542)
ACCENT_BOX = (616, 405, 1097, 542)
MARK_BOX = (616, 405, 800, 542)


def alpha_luminance(image: Image.Image) -> Image.Image:
    """Alfa del trazo claro, eliminando el ruido del fondo negro."""
    gray = np.asarray(image.convert("L"), dtype=np.float32)
    alpha = np.clip((gray - 26.0) / (240.0 - 26.0), 0.0, 1.0)
    alpha[gray < 26] = 0.0
    return Image.fromarray((alpha * 255).astype(np.uint8), mode="L")


def alpha_red(image: Image.Image) -> Image.Image:
    """Alfa del acento rojo, eliminando el blanco y el fondo negro."""
    pixels = np.asarray(image.convert("RGB"), dtype=np.float32)
    redness = pixels[:, :, 0] - np.maximum(pixels[:, :, 1], pixels[:, :, 2])
    alpha = np.clip((redness - 24.0) / (195.0 - 24.0), 0.0, 1.0)
    alpha[redness < 24] = 0.0
    return Image.fromarray((alpha * 255).astype(np.uint8), mode="L")


def tinted(mask: Image.Image, color: tuple[int, int, int]) -> Image.Image:
    result = Image.new("RGBA", mask.size, color + (0,))
    result.putalpha(mask)
    return result


def trimmed(mask: Image.Image, padding: int = 12) -> Image.Image:
    box = mask.point(lambda value: 255 if value > 24 else 0).getbbox()
    if box is None:
        raise RuntimeError("No se encontró contenido en el logotipo original.")
    left, top, right, bottom = box
    return mask.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(mask.width, right + padding),
            min(mask.height, bottom + padding),
        )
    )


def wordmark(source: Image.Image, car_color: tuple[int, int, int], padding: int = 14) -> Image.Image:
    """CAR en `car_color` + LIFE en rojo, con el espaciado del JPEG original.

    El JPEG trae CAR en blanco (luminancia) y LIFE en rojo (dominancia roja).
    Se componen las dos máscaras en un lienzo del tamaño de la fuente para
    no alterar la separación entre palabras ni redibujar ningún trazo.
    """
    canvas = Image.new("RGBA", source.size, (0, 0, 0, 0))
    car = alpha_luminance(source).crop(WORDMARK_BOX)
    life = alpha_red(source).crop(ACCENT_BOX)
    canvas.paste(tinted(car, car_color), WORDMARK_BOX[:2], car)
    canvas.paste(tinted(life, RED), ACCENT_BOX[:2], life)

    alpha = canvas.getchannel("A")
    box = alpha.point(lambda value: 255 if value > 24 else 0).getbbox()
    if box is None:
        raise RuntimeError("No se encontró el wordmark completo en el logotipo original.")
    left, top, right, bottom = box
    return canvas.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(source.width, right + padding),
            min(source.height, bottom + padding),
        )
    )


def square(mask: Image.Image, size: int = 128) -> Image.Image:
    """Centra una máscara recortada en un lienzo cuadrado sin deformarla."""
    mask = trimmed(mask, padding=4)
    side = max(mask.size)
    canvas = Image.new("L", (side, side), 0)
    canvas.paste(mask, ((side - mask.width) // 2, (side - mask.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


def save_png(image: Image.Image, path: Path) -> None:
    image.save(path, optimize=True)
    print(f"{path.name}: {image.width}x{image.height} · {path.stat().st_size} bytes")


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGB")
    if source.size != (1200, 896):
        raise RuntimeError(f"Tamaño inesperado del logotipo: {source.size}")

    # Wordmark completo: CAR + LIFE. LIFE siempre en rojo; CAR cambia según el
    # fondo (negro sobre superficies claras, blanco sobre superficies oscuras).
    save_png(wordmark(source, BLACK), OUTPUT / "carlife-dark.png")
    save_png(wordmark(source, WHITE), OUTPUT / "carlife-light.png")
    save_png(wordmark(source, RED), OUTPUT / "carlife-red.png")

    # Acento original: se conserva como recurso decorativo para piezas amplias.
    accent = trimmed(alpha_red(source).crop(ACCENT_BOX), padding=10)
    save_png(tinted(accent, RED), OUTPUT / "carlife-accent-red.png")
    save_png(tinted(accent, WHITE), OUTPUT / "carlife-accent-light.png")

    # Isotipo: el trazo rojo del acento, simple y legible en tamaños pequeños.
    mark = square(alpha_red(source).crop(MARK_BOX))
    save_png(tinted(mark, RED), OUTPUT / "carlife-mark.png")
    save_png(tinted(mark, BLACK), OUTPUT / "carlife-mark-dark.png")
    save_png(tinted(mark, WHITE), OUTPUT / "carlife-mark-light.png")

    # Favicon: isotipo rojo sobre negro, con contraste garantizado en cualquier
    # tema del navegador. Se genera a 128 px para conservar nitidez en retina.
    favicon = Image.new("RGBA", (128, 128), BLACK + (255,))
    favicon.alpha_composite(tinted(mark, RED))
    save_png(favicon, FAVICON)


if __name__ == "__main__":
    main()
