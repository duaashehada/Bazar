const express = require("express");
const router = express.Router();
const fs = require("fs");

const app = express();
app.use(router);

router.get("/", (req, res) => {
  res.json("hello world from catalog");
});

router.get("/search", (req, res) => {
  let Topic = req?.query?.Topic;
  const result = [];
  console.log("in catalog in search end point");
  let fileData = fs.readFileSync("./BazarBooks2.json");
  let BazarBooks = JSON.parse(fileData);
  for (const element of BazarBooks) {
    if (element["topic"] == Topic) {
      result.push(element);
    }
  }

  res.json(result);
});

router.get("/info", (req, res) => {
  const temp = req?.query?.id;
  let id = parseInt(temp);
  console.log("in catalog in info end point");
  let fileData = fs.readFileSync("./BazarBooks2.json");
  let BazarBooks = JSON.parse(fileData);
  const result = [];
  for (const element of BazarBooks) {
    if (element["id"] == id) {
      result.push(element);
    }
  }
  res.json(result);
});

router.put("/update", (req, res) => {
  const temp = req?.query?.id;
  let id = parseInt(temp);
  console.log("in catalog in update end point");
  let fileData = fs.readFileSync("./BazarBooks2.json");
  let BazarBooks = JSON.parse(fileData);
  const result = [];
  for (const element of BazarBooks) {
    if (element["id"] == id) {
      element["number of item in stock"] =
        parseInt(element["number of item in stock"]) - 1;
      result.push(element);
    }
  }
  // result[0]["number of item in stock"] =
  //   parseInt(result[0]["number of item in stock"]) - 1;

  fs.writeFile("BazarBooks2.json", JSON.stringify(BazarBooks), (error) => {
    if (error != null) {
      console.log(error);
    }
  });

  res.json(result);
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, "0.0.0.0", console.log(`server is running on ${PORT}`));
