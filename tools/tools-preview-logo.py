from PIL import Image

logo = Image.open('frontend/public/logo/logo-jaymotos.png').convert('RGBA')

for name, bg in [('negro', (0, 0, 0, 255)), ('gris', (128, 128, 128, 255)), ('blanco', (255, 255, 255, 255))]:
    canvas = Image.new('RGBA', (logo.width + 80, logo.height + 80), bg)
    canvas.paste(logo, (40, 40), logo)
    canvas.convert('RGB').save(f'frontend/public/logo/_preview_{name}.png')

print('preview done')
