const { capitalize, replace, kebabCase } = require('lodash');
const childProcess = require('child_process')
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

module.exports.executeScript = (path) => {
  return new Promise((resolve) => {
    this.invoked = false;
    const process = childProcess.fork(path);

    process.on('error', (err) => {
        if (this.invoked) {
          throw new Error('Executing script twice.');
        }
        this.invoked = true;
        resolve(err);
    });

    process.on('exit', (code) => {
        if (this.invoked) {
          throw new Error('Executing script twice.');
        }
        this.invoked = true;
        const err = code === 0 ? null : new Error('exit code ' + code);
        if (err) {
          throw err;
        }
        resolve(err);
    });
  });
}

