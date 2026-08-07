import glob
from PIL import Image
import os

# Create a directory for cropped images if you want to keep originals, or just overwrite
os.makedirs('cropped', exist_ok=True)

for f in glob.glob('*.jpeg'):
    img = Image.open(f)
    width, height = img.size
    
    # Simple center crop for these screenshots
    # Most of these screenshots are tall mobile screens where the product is in the center
    # Let's crop to a square around the center
    
    # We want a square crop
    crop_size = min(width, height)
    
    # We might want to crop a bit more to remove the top/bottom UI elements
    # and just focus on the center where the product is.
    left = 0
    right = width
    top = int(height * 0.25) # Skip top 25% (header, etc)
    bottom = int(height * 0.75) # Skip bottom 25% (footer, etc)
    
    cropped_img = img.crop((left, top, right, bottom))
    
    # Save the cropped image
    cropped_img.save(os.path.join('cropped', f))
    print(f"Cropped {f}")

print("All images cropped successfully. You can now move them from the 'cropped' folder to replace the originals.")
