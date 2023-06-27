class TrieNode {
  constructor() {
    this.children = {};
    this.products = [];
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
  // We find the highest node in the trie that corresponds to the search term.
  // TODO: search word-by-word instead of for the full text. Take the
  // intersection of products per word searched.
  let cur = trie;
  for (const char of simplify(searchTerm)) {
    let node = cur.children[char];
    if (!node) {
      for (const id of Object.keys(products)) {
        document.getElementById(`product-${id}`).style = "display:none;";
      }
      return;
    }
    cur = node;
  }

  const toHide = new Set();
  for (const id of Object.keys(products)) {
    toHide.add(id);
  }

  traverseTrie(cur, (node) => {
    for (const id of node.products) {
      toHide.delete(id);
    }
  });

  for (const id of Object.keys(products)) {
    document.getElementById(`product-${id}`).style = toHide.has(id)
      ? "display:none;"
      : "";
  }
}

async function main() {
  const res = await fetch("api/products");
  const products = await res.json();
  const productList = document.getElementById("product-list");

  // Construct a trie for searching.
  const trie = new TrieNode();

  for (const [id, product] of Object.entries(products)) {
    let cur = trie;
    for (const char of simplify(product.name)) {
      let node = cur.children[char];
      if (!node) {
        node = new TrieNode();
        cur.children[char] = node;
      }
      cur = node;
    }
    cur.products.push(id);
  }

  // We constructed the trie first so that the list elements are in a nice
  // order.
  traverseTrie(trie, (node) => {
    for (const id of node.products) {
      const product = products[id];
      const a = document.createElement("a");
      a.href = `products/${id}`;
      a.className = "list-group-item list-group-item-action";
      a.id = `product-${id}`;
      a.innerHTML = product.name;
      productList.appendChild(a);
    }
  });

  const searchBox = document.getElementById("search-box");
  searchBox.addEventListener("input", (e) => {
    updateResults(e.target.value, products, trie);
  });
  searchBox.value = "";
  updateResults(searchBox.value, products, trie);
}

main();
