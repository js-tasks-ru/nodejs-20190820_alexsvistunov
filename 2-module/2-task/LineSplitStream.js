const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let data = chunk.toString();
    if (this.lastData) {
      data = this.lastData + data;
    }

    const lines = data.split(os.EOL);
    this.lastData = lines.pop();
    lines.forEach(this.push.bind(this));
    callback();
  }

  _flush(callback) {
    if (this.lastData) {
      this.push(this.lastData);
    }
    this.lastData = null;
    callback();
  }
}

module.exports = LineSplitStream;
