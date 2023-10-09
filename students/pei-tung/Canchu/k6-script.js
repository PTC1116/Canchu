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
  const myIp = '13.211.10.154';
  const token ='token';
  const headers = {
    Authorization: `${token}`,
  };
  const res = http.get(
    `http://canchu-1204697482.ap-southeast-2.elb.amazonaws.com/api/1.0/posts/search`,
    {
      headers,
    },
  );
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
