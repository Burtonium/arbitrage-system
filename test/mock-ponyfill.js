const ponyfill = require('fetch-ponyfill')();
const fetchMock = require('fetch-mock');

const fetchMockInstance = fetchMock.sandbox();

Object.assign(fetchMockInstance.config, {
  Headers: ponyfill.Headers,
  Request: ponyfill.Headers,
  Response: ponyfill.Response,
  fetch: ponyfill.fetch,
  fallbackToNetwork: true, 
  warnOnFallback: true
});

const mock = require('mock-require');
require('./mock')(fetchMockInstance);
mock('fetch-ponyfill', () => { return { fetch: fetchMockInstance } });

module.exports = fetchMockInstance;