class TrieNode {
  constructor() {
    this.children = {};
    this.products = new Set();
  }
}

function* traverseTrie2(trie) {
  // Pre-order DFS
  yield trie;
  for (const child of Object.values(trie.children)) {
    yield* traverseTrie2(child);
  }
}

function simplify(text) {
  // We make it easier for users to search for things.
  return text
    .toLowerCase()
    .split("")
    .filter((char) => /[a-z0-9]/.test(char));
}

function updateResults(searchTerm, products, trie) {
  let toShow = new Set(Object.keys(products));
  for (const word of searchTerm.split(/(\s+)/)) {
    let cur = trie;
    // We find the node in the trie that corresponds to the word.
    for (const char of simplify(word)) {
      if (!cur) {
        break;
      }
      cur = cur.children[char];
    }

    const curProducts = new Set();
    if (cur) {
      for (const node of traverseTrie2(cur)) {
        console.log(node);
        for (const id of node.products) {
          curProducts.add(id);
        }
      }
    }
    toShow = new Set([...toShow].filter((i) => curProducts.has(i)));
    if (toShow.size === 0) {
      break;
    }
  }

  for (const id of Object.keys(products)) {
    document.getElementById(`product-${id}`).style = toShow.has(id)
      ? ""
      : "display:none;";
  }
}

async function main() {
  const res = await fetch("api/products");
  const products = await res.json();
  const productList = document.getElementById("product-list");

  // Construct a trie for searching.
  const trie = new TrieNode();
  const entries = Object.entries(products);
  // We iterate in reverse order so that new products are displayed first.
  for (let i = entries.length - 1; i >= 0; i--) {
    const [id, product] = entries[i];

    const a = document.createElement("a");
    a.href = `products/${id}`;
    a.className = "list-group-item list-group-item-action";
    a.id = `product-${id}`;
    a.innerHTML = product.name;
    productList.appendChild(a);

    for (const word of product.name.split(/\s+/)) {
      let cur = trie;
      for (const char of simplify(word)) {
        let node = cur.children[char];
        if (!node) {
          node = new TrieNode();
          cur.children[char] = node;
        }
        cur = node;
      }
      cur.products.add(id);
    }
  }

  const searchBox = document.getElementById("search-box");
  searchBox.addEventListener("input", (e) => {
    updateResults(e.target.value, products, trie);
  });
  searchBox.value = "";
  updateResults(searchBox.value, products, trie);
}

main();
