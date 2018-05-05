const { capitalize, replace, kebabCase } = require('lodash');

module.exports.wait = millis => new Promise((resolve) => {
  setInterval(resolve, millis);
});

module.exports.precisionRound = (number, precision) => {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
};

module.exports.toWords = name => capitalize(replace(kebabCase(name), new RegExp('-', 'g'), ' '));

module.exports.percentDifference = (val1, val2) => {
  const a = parseFloat(val1);
  const b = parseFloat(val2);
  return Math.abs(a - b) / ((a + b) / 2) * 100;
};

