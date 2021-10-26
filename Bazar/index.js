const { request } = require("express");
const express = require("express");
const router = express.Router();
const axios = require("axios");
// const fetch = require("node-fetch");

const app = express();

app.use(router);

router.get("/search", async (req, res) => {
  const Topic = req?.query?.Topic;
  let result;
  axios.get(`http://localhost:3000/search?Topic=${Topic}`).then((resp) => {
    // console.log(resp.data);
    result = resp.data;
    console.log(result);
    res.json(result);
  });
});

router.get("/info", async (req, res) => {
  const id = req?.query?.id;
  let result;
  axios.get(`http://localhost:3000/info?id=${id}`).then((resp) => {
    // console.log(resp.data);
    result = resp.data;
    console.log(result);
    res.json(result);
  });
});

router.post("/purchase", async (req, res) => {
  const id = req?.query?.id;
  let result;
  axios.post(`http://localhost:5000/purchase?id=${id}`).then((resp) => {
    // console.log(resp.data);
    result = resp.data;
    console.log(result);
    res.json(result);
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", console.log(`server is running on ${PORT}`));

module.exports = router;
