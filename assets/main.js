async function main() {
  console.log("1");
  const res = await fetch("api/products");
  const products = await res.json();

  console.log(products);
  for (const [id, product] of Object.entries(products)) {
    const a = document.createElement("a");
    a.href = `products/${id}`;
    a.className = "list-group-item list-group-item-action";
    a.innerHTML = product.name;
    document.getElementById("product-list").appendChild(a);
  }
  console.log("3");
}

main();
