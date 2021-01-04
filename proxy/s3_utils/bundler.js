const sizeColorServicePath = 'http://3.18.69.132:3001';
const productServicePath = 'http://54.241.116.3:3002';

let promise1 = axios.get(`${sizeColorServicePath}/bundle.js`);
let promise2 = axios.get(`${productServicePath}/bundle.js`);

Promise.all([promise1, promise2])
  .then( (responses) => {
    let bundles = '';
    responses.forEach((response) => {
      bundles += response.data;
    });
    fs.writeFile('bundled.js', bundles, (err) => {
      if (err) console.error('Cannot write file');
      console.log('File has been saved');
    })
  })
  .catch((err) => {
    console.log('error with bundle request');
    res.end();
  });