const { request } = require("express");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const bodyParser = require("body-parser");
const NodeCache = require("node-cache");
// const fetch = require("node-fetch");

const app = express();
const cache = new NodeCache({ stdTTL: 35 });
let loadBalancing_flag = true;

//middleware
const verifyCache = (req, res, next) => {
  try {
    const Topic = req?.query?.Topic;
    const id = req?.query?.id;
    if (cache.has(Topic)) {
      return res.status(200).json(cache.get(Topic));
    } else if (cache.has(id)) {
      return res.status(200).json(cache.get(id));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};

app.use(router);

router.use(bodyParser.json());

router.get("/search", verifyCache, async (req, res) => {
  const Topic = req?.query?.Topic;
  let result;
  console.log("request from bazat to catalog ");
  try {
    if (loadBalancing_flag) {
      axios.get(`http://10.5.0.5:3000/search?Topic=${Topic}`).then((resp) => {
        // console.log(resp.data);
        result = resp.data;
        cache.set(Topic, result);
        console.log(result);
        loadBalancing_flag = false;
        res.json(result);
      });
    } else {
      axios.get(`http://10.5.0.4:7000/search?Topic=${Topic}`).then((resp) => {
        // console.log(resp.data);
        result = resp.data;
        cache.set(Topic, result);
        console.log(result);
        loadBalancing_flag = true;
        res.json(result);
      });
    }
  } catch (error) {
    if (error) {
      res.send("the topic is un-available or the data not found");
    }
  }
});

router.get("/info", verifyCache, async (req, res) => {
  const id = req?.query?.id;
  let result;
  console.log("request from bazat to catalog ");
  if (loadBalancing_flag) {
    axios.get(`http://10.5.0.5:3000/info?id=${id}`).then((resp) => {
      // console.log(resp.data);
      result = resp.data;
      cache.set(id, result);
      console.log(result);
      loadBalancing_flag = false;
      res.json(result);
    });
  } else {
    axios.get(`http://10.5.0.4:7000/info?id=${id}`).then((resp) => {
      // console.log(resp.data);
      result = resp.data;
      cache.set(id, result);
      console.log(result);
      loadBalancing_flag = true;
      res.json(result);
    });
  }
});

router.post("/purchase", async (req, res) => {
  const id = req?.body?.id;
  let result;
  try {
    if (loadBalancing_flag) {
      axios.post(`http://10.5.0.6:5000/purchase`, { id: id }).then((resp) => {
        result = resp.data;
        console.log(result);
        console.log("request from bazar to order");
        //use invalidate technique to ensure consistancy in the cache and servers
        cache.del(id);
        cache.del(result.Topic);
        loadBalancing_flag = false;
        res.json(result.msg);
      });
    } else {
      axios.post(`http://10.5.0.3:6000/purchase`, { id: id }).then((resp) => {
        result = resp.data;
        console.log(result);
        console.log("request from bazar to order");
        //use invalidate technique to ensure consistancy in the cache and servers
        cache.del(id);
        cache.del(result.Topic);
        loadBalancing_flag = true;
        res.json(result.msg);
      });
    }
  } catch (error) {
    if (error) {
      res.send("the item that you are trying to by not found");
    }
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", console.log(`server is running on ${PORT}`));

module.exports = router;
