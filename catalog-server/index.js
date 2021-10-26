const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
// const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
// app.use(cors());
app.use(router);

let fileData = fs.readFileSync("./BazarBooks.json");
let BazarBooks = JSON.parse(fileData);

router.get("/", (req, res) => {
  res.json("hello world from catalog");
});

router.get("/search", (req, res) => {
  let Topic = req?.query?.Topic;
  const result = [];
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
  const result = [];
  for (const element of BazarBooks) {
    if (element["id"] == id) {
      result.push(element);
      element["id"] = parseInt(element["id"]) - 1;
    }
  }
  result[0]["number of item in stock"] =
    parseInt(result[0]["number of item in stock"]) - 1;

  fs.writeFile("BazarBooks.json", JSON.stringify(BazarBooks), (error) =>
    console.log(error)
  );

  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", console.log(`server is running on ${PORT}`));
