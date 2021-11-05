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
  let orderFileData = fs.readFileSync("./OrderList.json");
  let OrderList = JSON.parse(orderFileData);
  axios.get(`http://192.168.1.17:3000/info?id=${id}`).then((resp) => {
    // console.log(resp.data);
    result = resp.data;
    if (parseInt(result[0]["number of item in stock"]) > 0) {
      axios.put(`http://192.168.1.17:3000/update?id=${id}`).then((e) => {
        finalResult = e.data;
        console.log(finalResult);
        OrderList.push(finalResult[0]);
        fs.writeFile("OrderList.json", JSON.stringify(OrderList), (error) =>
          console.log(error)
        );
        res.json(`you purchaced the ${finalResult[0]["titel"]} successfuly :)`);
      });
    } else {
      res.json(`this item not found :(`);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", console.log(`server is running on ${PORT}`));

module.exports = router;
