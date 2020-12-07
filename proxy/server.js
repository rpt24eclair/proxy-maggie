const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const port = 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/bundles', (req, res) => {
  console.log('here');
  promise1 = axios.get(`http://localhost:3001/dist/bundle.js`);
  promise2 = axios.get(`http://localhost:3002/bundle.js`);

  Promise.all([promise1, promise2])
    .then( (response) => {
      // console.log('I have a response');
      // console.log(response[1])

      res.send(response[1].data);
    })
    .catch((err) => {
      console.log('error with bundle request');
      res.end();
    })
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