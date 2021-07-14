/**
 * Used to test 'raw' API routes
 */
const k8s = require('@kubernetes/client-node');
const request = require('request');

const kc = new k8s.KubeConfig();
kc.loadFromCluster();
// kc.loadFromDefault();

const opts = {};
kc.applyToRequest(opts);

request.get(`${kc.getCurrentCluster().server}/api/v1/pods`, opts, (error, response, body) => {
  if (error) {
    console.log(`error: ${error}`);
  }
  console.log(body);
});

request.get(`${kc.getCurrentCluster().server}/api/v1/nodes`, opts, (error, response, body) => {
  if (error) {
    console.log(`error: ${error}`);
  }
  console.log(body);
});
