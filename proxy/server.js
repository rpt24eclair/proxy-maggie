const express = require('express');
const path = require('path');
const axios = require('axios');
const port = 3000;
const app = express();
//change to local host if desired for environment 'http://localhost:3001' 'http://localhost:3002'
const sizeColorServicePath = 'http://3.18.69.132:3001';
const productServicePath = 'http://54.241.116.3:3002';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/bundles', (req, res) => {

  let promise1 = axios.get(`${sizeColorServicePath}/bundle.js`);
  let promise2 = axios.get(`${productServicePath}/bundle.js`);

  Promise.all([promise1, promise2])
    .then( (responses) => {
      let bundles = '';
      responses.forEach((response) => {
        bundles += response.data;
      });
      res.send(bundles);
    })
    .catch((err) => {
      console.log('error with bundle request');
      res.end();
    });
});

app.get('/products/:productId/summary', (req, res) => {
  let id = req.params.productId;

  axios({
    method: 'get',
    url: `${productServicePath}/products/${id}/summary`
  })
  .then((response) => {
    res.send(response.data);
  })
  .catch((err) => {
    console.log(err);
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

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});