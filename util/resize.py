from sys import argv
import json
from PIL import Image
import grequests
from io import BytesIO
import cloudinary.uploader


def main():
    cloudinary.config(
        cloud_name="redacted",
        api_key="redacted",
        api_secret="redacted",
    )

    with open("./product-data.json") as f:
        products = json.loads(f.read())

    ids = []
    urls = []
    for id, data in filter(lambda t: int(t[0]) > 90, products.items()):
        ids.append(id)
        urls.append(data["picture"])

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
    }
    for id, im in zip(
        ids,
        map(
            lambda r: Image.open(BytesIO(r.content)).resize((224, 224)),
            grequests.map(grequests.get(u, headers=headers) for u in urls),
        ),
    ):
        im.save(f"./imgs/{id}.png")
        res = cloudinary.uploader.upload(f"./imgs/{id}.png", public_id=f"p{id}")
        products[id]["picture"] = res["url"]
        print(id)

    with open("./product-data.json", "w") as f:
        f.write(json.dumps(products))


if __name__ == "__main__":
    main()
