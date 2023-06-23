async function main() {
  const res = await fetch("api/products");
  const products = await res.json();

  for (const [id, product] of Object.entries(products)) {
    const a = document.createElement("a");
    a.href = `products/${id}`;
    a.className = "list-group-item list-group-item-action";
    a.innerHTML = product.name;
    document.getElementById("product-list").appendChild(a);
  }
}

main();
