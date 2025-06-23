from PIL import Image, ImageDraw
import os

# Create icon directory if it doesn't exist
os.makedirs('assets', exist_ok=True)

# Create 1024x1024 icon (main icon)
icon_size = 1024
img = Image.new('RGB', (icon_size, icon_size), '#4CAF50')  # Green background
draw = ImageDraw.Draw(img)

# Draw purple bell
bell_color = '#9C27B0'  # Purple
bell_center_x, bell_center_y = icon_size // 2, icon_size // 2 - 50
bell_width, bell_height = 400, 450

# Bell body (trapezoid shape)
bell_top_width = 200
bell_bottom_width = 350
bell_top_y = bell_center_y - bell_height // 2
bell_bottom_y = bell_center_y + bell_height // 2

# Draw bell body
bell_points = [
    (bell_center_x - bell_top_width // 2, bell_top_y),
    (bell_center_x + bell_top_width // 2, bell_top_y),
    (bell_center_x + bell_bottom_width // 2, bell_bottom_y),
    (bell_center_x - bell_bottom_width // 2, bell_bottom_y)
]
draw.polygon(bell_points, fill=bell_color)

# Draw bell top (small rectangle)
top_width, top_height = 60, 80
top_x = bell_center_x - top_width // 2
top_y = bell_top_y - top_height
draw.rectangle([top_x, top_y, top_x + top_width, top_y + top_height], fill=bell_color)

# Draw clapper (small circle)
clapper_radius = 30
clapper_x = bell_center_x
clapper_y = bell_bottom_y - 50
draw.ellipse([clapper_x - clapper_radius, clapper_y - clapper_radius, 
              clapper_x + clapper_radius, clapper_y + clapper_radius], fill='#FFD700')  # Gold clapper

# Save main icon
img.save('assets/icon.png')

# Create adaptive icon (512x512)
adaptive_img = img.resize((512, 512), Image.Resampling.LANCZOS)
adaptive_img.save('assets/adaptive-icon.png')

# Create favicon (48x48)
favicon_img = img.resize((48, 48), Image.Resampling.LANCZOS)
favicon_img.save('assets/favicon.png')

# Create splash icon (400x400)
splash_img = img.resize((400, 400), Image.Resampling.LANCZOS)
splash_img.save('assets/splash-icon.png')

print('✅ All app icons created successfully!')
print('📁 Files created:')
print('   - assets/icon.png (1024x1024)')
print('   - assets/adaptive-icon.png (512x512)')
print('   - assets/favicon.png (48x48)')
print('   - assets/splash-icon.png (400x400)')
