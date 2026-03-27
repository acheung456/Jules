import urllib.request
import os

images = {
    "maya-short-down-jacket.jpg": "https://moncler-cdn.thron.com/delivery/public/image/moncler/I20911A5360068950999_M/dpx6uv/std/1024x1536/maya-short-down-jacket.jpg",
    "bormes-gilet.jpg": "https://moncler-cdn.thron.com/delivery/public/image/moncler/H20911A0014453333999_M/e9j0kq/std/1024x1536/bormes-gilet.jpg",
    "montbeliard-short-down-jacket.jpg": "https://moncler-cdn.thron.com/delivery/public/image/moncler/I20911A0014268950999_M/a3xw5z/std/1024x1536/montbeliard-short-down-jacket.jpg",
    "hintertux-short-down-jacket.jpg": "https://moncler-cdn.thron.com/delivery/public/image/moncler/I20971A0003053071999_M/8zjw3v/std/1024x1536/hintertux-short-down-jacket.jpg",
    "wool-beanie.jpg": "https://moncler-cdn.thron.com/delivery/public/image/moncler/I20913B00052A9327999_M/4yjw3v/std/1024x1536/wool-beanie.jpg"
}

opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'), ('Accept', 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8')]
urllib.request.install_opener(opener)

for filename, url in images.items():
    filepath = os.path.join("static", "images", filename)
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(url, filepath)
        print(f"Success: {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
