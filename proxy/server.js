const express = require('express');
const path = require('path');
const axios = require('axios');
const port = 3000;
const app = express();

const sizeColorServicePath = '18.219.195.236:3001'
const productServicePath = '3.101.148.73:3002'

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
    url: `http://localhost:3002/products/${id}/summary`
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
  axios.get(`http://localhost:3001/shoes/${shoeID}/colors`)
  .then((colors) => {
    res.send(colors.data);
  })
    .catch(err => {
      console.error(err);
    });
})

app.get('/shoes/:shoeID/sizes', (req, res) => {
  let shoeID = req.params.shoeID;

  axios.get(`http://localhost:3001/shoes/${shoeID}/sizes`)
    .then(sizes => {
      res.send(sizes.data);
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('/shoes/:shoeID/colors/:colorID/quantities', (req, res) => {
  let {shoeID, colorID} = req.params;

  axios.get(`http://localhost:3001/shoes/${shoeID}/colors/${colorID}/quantities`)
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