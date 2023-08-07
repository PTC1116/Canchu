const http = require('k6/http');
const { check, sleep } = require('k6');
export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 40,
      timeUnit: '1s',
      duration: '20s',
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
  },
};
// test HTTP
export default function () {
  const res = http.get('http://{your url}/api/1.0/posts/search');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
