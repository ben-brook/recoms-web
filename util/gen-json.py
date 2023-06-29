from sys import argv


def main():
    out = ""
    i = 0
    id = int(argv[1])
    with open("./temp-products") as f:
        for line in f.readlines():
            if line.strip() == "":
                continue

            if i == 0:
                out += f',\n"{id}": {{\n"name": "{line.strip()}",\n'
                id += 1
            elif i == 1:
                out += f'"description": "{line.strip()}",\n'
            else:
                out += f'"picture": "{line.strip()}"\n}}'

            i = (i + 1) % 3

    with open("./output", "w") as f:
        f.write(out)


if __name__ == "__main__":
    main()
