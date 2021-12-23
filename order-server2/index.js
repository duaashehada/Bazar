const { request } = require("express");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(router);

router.use(bodyParser.json());

router.post("/purchase", (req, res) => {
  const id = req?.body?.id;
  let result;
  console.log("in order in purchase end point");
  let orderFileData = fs.readFileSync("./OrderList2.json");
  let OrderList = JSON.parse(orderFileData);
  axios.get(`http://10.5.0.5:3000/info?id=${id}`).then((resp) => {
    // console.log(resp.data);
    result = resp.data;
    if (parseInt(result[0]["number of item in stock"]) > 0) {
      axios.put(`http://10.5.0.5:3000/update?id=${id}`).then((e) => {
        finalResult = e.data;
        console.log(finalResult);
        OrderList.push(finalResult[0]);
        fs.writeFile("OrderList2.json", JSON.stringify(OrderList), (error) => {
          if (error != null) {
            console.log(error);
          }
        });
        //notify other replica to update database to ensure the consistancy
        axios.put(`http://10.5.0.6:5000/updateDB?id=${id}`);
        res.json({
          msg: `you purchaced the ${finalResult[0]["titel"]} successfuly :)`,
          Topic: finalResult[0]["topic"],
        });
      });
    } else {
      res.json(`this item not found :(`);
    }
  });
});

router.put("/updateDB", (req, res) => {
  const id = req?.query?.id;
  let orderFileData = fs.readFileSync("./OrderList2.json");
  let OrderList = JSON.parse(orderFileData);
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
  fs.writeFile("BazarBooks2.json", JSON.stringify(BazarBooks), (error) => {
    if (error != null) {
      console.log(error);
    }
  });
  finalResult = result[0];
  console.log(finalResult);
  OrderList.push(finalResult);
  fs.writeFile("OrderList2.json", JSON.stringify(OrderList), (error) => {
    if (error != null) {
      console.log(error);
    }
  });
  console.log("updating database done succefully");
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, "0.0.0.0", console.log(`server is running on ${PORT}`));

module.exports = router;
