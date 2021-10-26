const { request } = require("express");
const express = require("express");
const router = express.Router();
const axios = require("axios");
// const fetch = require("node-fetch");

const app = express();

app.use(router);

router.post("/purchase", async (req, res) => {
  const id = req?.query?.id;
  let result;
  axios.get(`http://localhost:3000/info?id=${id}`).then((resp) => {
    // console.log(resp.data);
    result = resp.data;
    console.log(result);
    if (parseInt(result[0]["number of item in stock"]) > 0) {
      axios.put(`http://localhost:3000/update?id=${id}`);
      res.json(`you purchaced the ${result[0]["titel"]} successfuly :)`);
    } else {
      res.json(`this item not found :(`);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", console.log(`server is running on ${PORT}`));

module.exports = router;
