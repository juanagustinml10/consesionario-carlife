from PIL import Image
src = Image.open('logo agencia.jpeg').convert('RGB')
arr = src.crop((0, 400, 1376, 600)).resize((2064, 300), Image.LANCZOS)
arr.save('_audit_swash.png')
# Zoom derecha del swash (la zona de trazos discontinuos)
src.crop((700, 400, 1376, 600)).resize((2028, 600), Image.LANCZOS).save('_audit_swash_right.png')
print('ok')
