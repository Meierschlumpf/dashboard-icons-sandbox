import cairosvg
from PIL import Image
from pathlib import Path
import sys

def file_size_readable(size_bytes):
    """Convert bytes to a human-readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024:
            return f"{size_bytes:.2f} {unit}"
            #size_bytes /= 1024
        size_bytes /= 1024
    return f"{size_bytes:.2f} TB"

def convert_svg_to_png(svg_path, png_path):
    """Convert SVG to PNG."""
    try:
        png_data = cairosvg.svg2png(url=str(svg_path), output_height=512)

        with open(png_path, 'wb') as f:
            f.write(png_data)
        print(f"Converted PNG: {png_path} ({file_size_readable(png_path.stat().st_size)})")

    except Exception as e:
        print(f"Failed to convert {svg_path} to PNG: {e}")
        raise e

def convert_image_to_webp(image_path, webp_path):
    """Convert an image (PNG or other) to WEBP."""
    try:
        image = Image.open(image_path).convert("RGBA")
        image.save(webp_path, format='WEBP')
        print(f"Converted WEBP: {webp_path} ({file_size_readable(webp_path.stat().st_size)})")

    except Exception as e:
        print(f"Failed to convert {image_path} to WEBP: {e}")
        raise e

ROOT_DIR = Path(__file__).resolve().parent
SVG_DIR = ROOT_DIR / "svg"
PNG_DIR = ROOT_DIR / "png"
WEBP_DIR = ROOT_DIR / "webp"

# Ensure the output folders exist
PNG_DIR.mkdir(parents=True, exist_ok=True)
WEBP_DIR.mkdir(parents=True, exist_ok=True)

FILE_NAME = sys.argv[1]
SVG_PATH = SVG_DIR / (FILE_NAME + ".svg")
PNG_PATH = PNG_DIR / (FILE_NAME + ".png")
WEBP_PATH = WEBP_DIR / (FILE_NAME + ".webp")

def main():
    if SVG_PATH.exists():
        convert_svg_to_png(SVG_PATH, PNG_PATH)
    
    if PNG_PATH.exists():
        convert_image_to_webp(PNG_PATH, WEBP_PATH)


if __name__ == "__main__":
    main()