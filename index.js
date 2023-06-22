const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;
const productPage = fs.readFileSync("./assets/product.html", "utf8");
const productData = require("./product-data.json");
const rootOps = { root: __dirname };

app.get("/", (_, res) => res.sendFile("./assets/main.html", rootOps));

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const page = productPage
    .replace(/\$name/, productData[id].name)
    .replace(/\$pic/, productData[id].picture)
    .replace(/\$desc/, productData[id].description);

  res.type("html").send(page);
});

app.get("/api/products", (_, res) => {
  res.sendFile("product-data.json", rootOps);
});

// Assets
const reqToPath = {
  "bootstrap.min.css": "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "bootstrap.min.css.map":
    "node_modules/bootstrap/dist/css/bootstrap.min.css.map",
  "bootstrap.min.js": "node_modules/bootstrap/dist/js/bootstrap.min.js",
  "bootstrap.min.js.map": "node_modules/bootstrap/dist/js/bootstrap.min.js.map",
  "main.js": "assets/main.js",
};
app.get("/assets/:name", (req, res) => {
  const { name } = req.params;
  if (!reqToPath[name]) {
    res.status(404).send();
  } else {
    res.sendFile(reqToPath[name], rootOps);
  }
});
app.get("/favicon.ico", (_, res) => {
  res.sendFile("assets/favicon.ico", rootOps);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
