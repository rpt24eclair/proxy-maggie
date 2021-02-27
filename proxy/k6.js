import { check } from "k6";
//import { sleep } from "k6";

import http from 'k6/http';

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '60s',
      preAllocatedVUs: 150,
      maxVUs: 150,
      gracefulStop: '60s',
    },
  },
};

export default function () {
  let res = http.get("http://localhost:3000/?prod=9900000");
  check(res, {
    "is status 200": (r) => r.status === 200
  });
}

// export default function () {
//   http.get('http://localhost:3000/?prod=9900000');
//   sleep(1);
// };