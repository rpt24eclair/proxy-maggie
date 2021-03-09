const newrelic = require('newrelic');
const express = require('express');
const path = require('path');
const axios = require('axios');
const port = 3000;
const app = express();
//change to local host if desired for environment 'http://localhost:3001' 'http://localhost:3002'
app.locals.newrelic = newrelic;

const sizeColorServicePath = 'http://54.174.50.6:3001';
// const productServicePath = 'http://54.241.116.3:3002';
const galleryServicePath = ' http://54.176.117.13:3004';
const feedbackServicePath = 'http://52.14.216.129:3003'

app.use(express.static(path.join(__dirname, 'public')));

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
      console.error(err);
    });
})

app.get('/shoes/:shoeID/sizes', (req, res) => {
  let shoeID = req.params.shoeID;

  axios.get(`${sizeColorServicePath}/shoes/${shoeID}/sizes`)
    .then(sizes => {
      res.send(sizes.data);
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('/shoes/:shoeID/colors/:colorID/quantities', (req, res) => {
  let {shoeID, colorID} = req.params;

  axios.get(`${sizeColorServicePath}/shoes/${shoeID}/colors/${colorID}/quantities`)
    .then(quantities => {
      res.send(quantities.data);
    })
    .catch(err => {
      console.log('this broke: shoeid and colorid');
    });
});

app.get('/shoes/:shoeId/reviews/:count', (req, res) => {
  let {shoeId, count} = req.params;
  axios.get(`${feedbackServicePath}/shoes/${shoeId}/reviews/${count}`)
  .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('/shoes/:shoeId/rating', (req, res) => {
  let {shoeId} = req.params;
  axios.get(`${feedbackServicePath}/shoes/${shoeId}/rating`)
  .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('/selection', async (req, res)=>{
  axios.get(`${sizeColorServicePath}/bundle.js`)
  .then(bundle => {
    res.send(bundle.data);
  })
  .catch (err => {
    console.log(err);
    res.end();
  })
});

app.get('/gallery', async (req, res)=>{
  axios.get(`${galleryServicePath}/bundle.js`)
  .then(bundle => {
    res.send(bundle.data);
  })
  .catch (err => {
    console.log(err);
    res.end();
  })
});

app.get('/feedback', async (req, res)=>{
  axios.get(`${feedbackServicePath}/bundle.js`)
  .then(bundle => {
    res.send(bundle.data);
  })
  .catch (err => {
    console.log(err);
    res.end();
  })
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});