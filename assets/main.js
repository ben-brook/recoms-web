class TrieNode {
  constructor() {
    this.children = {};
    this.products = new Set();
  }
}

// Linked list Queue implementation for trie BFS.
class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  enqueue(element) {
    const next = {};
    next.val = element;

    if (!this.head) {
      this.head = next;
      this.tail = next;
      return;
    }
    this.head.next = next;
    this.head = next;
  }

  dequeue() {
    const val = this.tail.val;

    if (this.tail == this.head) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.next;
    }

    return val;
  }

  isEmpty() {
    return this.head === null;
  }
}

function traverseTrie(trie, callback) {
  // We use a BFS to create by-length then by-alphabet traversal order.
  const queue = new Queue();
  queue.enqueue(trie);
  while (!queue.isEmpty()) {
    const cur = queue.dequeue();
    callback(cur);
    for (const child of Object.values(cur.children)) {
      queue.enqueue(child);
    }
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
      traverseTrie(cur, (node) => {
        for (const id of node.products) {
          curProducts.add(id);
        }
      });
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

    for (const word of product.name.split(/(\s+)/)) {
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
