const newrelic = require('newrelic');
const express = require('express');
const path = require('path');
const axios = require('axios');
const compression = require('compression');
const redis = require("redis");
const redis_client = redis.createClient(6379);

const port = 3000;
const app = express();
//change to local host if desired for environment 'http://localhost:3001' 'http://localhost:3002'
app.locals.newrelic = newrelic;

const sizeColorServicePath = 'http://54.174.50.6:3001';
// const productServicePath = 'http://54.241.116.3:3002';
const galleryServicePath = 'http://3.101.55.211:3004';
const feedbackServicePath = 'http://3.22.221.227:3003';

app.use(express.static(path.join(__dirname, 'public')));
app.use(compression())

function cache(req, res, next) {
  redis_client.get(req.url, (error, cachedData) => {
    if (error) throw error;
    if (cachedData != null) {
      res.send(cachedData);
    } else {
      next();
    }
  });
}

app.get('/products/:productId/summary', (req, res) => {
  // let id = req.params.productId;

  // axios({
  //   method: 'get',
  //   url: `${productServicePath}/products/${id}/summary`
  // })
  // .then((response) => {
  //   res.send(response.data);
  // })
  // .catch((err) => {
  //   console.error(err);
  //   res.send([]);
  // });
res.end()
});

app.get('/products/:productId/gallery', (req, res) => {
  let id = req.params.productId;

  axios({
    method: 'get',
    url: `${galleryServicePath}/products/${id}/gallery`
  })
  .then((response) => {
    res.send(response.data);
  })
  .catch((err) => {
    console.error(err);
    res.send([]);
  });
});

app.get('/shoes/:shoeID/colors', (req, res) => {
  let shoeID = req.params.shoeID;
  axios.get(`${sizeColorServicePath}/shoes/${shoeID}/colors`)
  .then((colors) => {
    res.send(colors.data);
  })
    .catch(err => {
      res.sendStatus(404);
    });
})

app.get('/shoes/:shoeID/sizes', (req, res) => {
  let shoeID = req.params.shoeID;

  axios.get(`${sizeColorServicePath}/shoes/${shoeID}/sizes`)
    .then(sizes => {
      res.send(sizes.data);
    })
    .catch(err => {
      res.sendStatus(404);
    });
});

app.get('/shoes/:shoeID/colors/:colorID/quantities', (req, res) => {
  let {shoeID, colorID} = req.params;
  console.log(req.url)

  axios.get(`${sizeColorServicePath}/shoes/${shoeID}/colors/${colorID}/quantities`)
    .then(quantities => {
      res.send(quantities.data);
    })
    .catch(err => {
      res.sendStatus(404);
    });
});

app.get('/shoes/:shoeId/reviews/:count', (req, res) => {
  let {shoeId, count} = req.params;
  axios.get(`${feedbackServicePath}/shoes/${shoeId}/reviews/${count}`)
  .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      res.sendStatus(404);
    });
});

app.get('/shoes/:shoeId/rating', (req, res) => {
  let {shoeId} = req.params;
  axios.get(`${feedbackServicePath}/shoes/${shoeId}/rating`)
  .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      res.sendStatus(404);
    });
});

app.get('/selection', cache, async (req, res)=>{
  axios.get(`${sizeColorServicePath}/bundle.js`)
  .then(bundle => {
    redis_client.setex(`/selection`, 3600, bundle.data);
    res.send(bundle.data);
  })
  .catch (err => {
    res.sendStatus(404);
  })
});

app.get('/gallery', cache, async (req, res)=>{
  axios.get(`${galleryServicePath}/bundle.js`)
  .then(bundle => {
    redis_client.setex(`/gallery`, 3600, bundle.data);
    res.send(bundle.data);
  })
  .catch (err => {
    res.sendStatus(404);
  })
});

app.get('/feedback', cache, async (req, res)=>{
  axios.get(`${feedbackServicePath}/bundle.js`)
  .then(bundle => {
    redis_client.setex(`req.url`, 3600, bundle.data);
    res.send(bundle.data);
  })
  .catch (err => {
    res.sendStatus(404);
  })
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});