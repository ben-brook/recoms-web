const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;
const mainPage = fs.readFileSync("main.html", "utf8");
const productPage = fs.readFileSync("product.html", "utf8");
const productData = require("./product_data.json");

app.get("/", (_, res) => res.type("html").send(mainPage));

app.get("/");

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const page = productPage
    .replace(/\$name/, productData[id].name)
    .replace(/\$pic/, productData[id].picture)
    .replace(/\$desc/, productData[id].description);

  res.type("html").send(page);
});

// Your own super cool function
var logger = function (req, res, next) {
  console.log("GOT REQUEST !");
  next(); // Passing the request to the next handler in the stack.
};

app.configure(function () {
  app.use(logger); // Here you add your logger to the stack.
  app.use(app.router); // The Express routes handler.
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
