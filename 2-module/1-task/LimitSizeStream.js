const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._limit = options.limit;
    this._data = '';
  }

  _transform(chunk, encoding, callback) {
    this._data += chunk;

    if (Buffer.byteLength(this._data) <= this._limit) {
      this.push(chunk);
    } else {
      callback(new LimitExceededError());
    }

    callback(null);
  }
}

module.exports = LimitSizeStream;
