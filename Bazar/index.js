const { request } = require("express");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const bodyParser = require("body-parser");
const NodeCache = require("node-cache");
// const fetch = require("node-fetch");

const app = express();
const cache = new NodeCache({ stdTTL: 15 });

app.use(router);

router.use(bodyParser.json());

router.get("/search", async (req, res) => {
  const Topic = req?.query?.Topic;
  let result;
  console.log("request from bazat to catalog ");
  axios.get(`http://10.5.0.5:3000/search?Topic=${Topic}`).then((resp) => {
    // console.log(resp.data);
    result = resp.data;
    console.log(result);
    res.json(result);
  });
});

router.get("/info", async (req, res) => {
  const id = req?.query?.id;
  let result;
  console.log("request from bazat to catalog ");
  axios.get(`http://10.5.0.5:3000/info?id=${id}`).then((resp) => {
    // console.log(resp.data);
    result = resp.data;
    console.log(result);
    res.json(result);
  });
});

router.post("/purchase", async (req, res) => {
  const id = req?.body?.id;
  let result;

  axios.post(`http://10.5.0.6:5000/purchase`, { id: id }).then((resp) => {
    result = resp.data;
    console.log(result);
    console.log("request from bazar to order");
    res.json(result);
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", console.log(`server is running on ${PORT}`));

module.exports = router;
