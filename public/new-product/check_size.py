import glob
from PIL import Image

for f in glob.glob('*.jpeg'):
    img = Image.open(f)
    print(f, img.size)
