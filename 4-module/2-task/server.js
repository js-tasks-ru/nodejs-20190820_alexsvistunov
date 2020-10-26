const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const FILE_LIMIT = 1e6;

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (!filepath) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested paths are forbidden');
        return;
      }

      if (+req.headers['content-length'] > FILE_LIMIT) {
        res.statusCode = 413;
        res.end('File is too big!');
        return;
      }

      const stream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: FILE_LIMIT});

      req
          .pipe(limitStream)
          .pipe(stream);

      limitStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.setHeader('Connection', 'close');
          res.end('File is too big');
        } else {
          res.statusCode = 501;
          res.setHeader('Connection', 'close');
          res.end('Internal server error');
        }

        fs.unlink(filepath, (error) => {});
      });

      stream
          .on('error', (error) => {
            if (error.code === 'EEXIST') {
              res.statusCode = 409;
              res.end('File exists');
            } else {
              res.statusCode = 501;
              res.end('Internal server error');
              fs.unlink(filepath, (error) => {});
            }
          })
          .on('close', (err) => {
            res.statusCode = 201;
            res.end('file has been saved');
          });

      res.on('close', () => {
        if (res.finished) return;
        fs.unlink(filepath, (error) => {});
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
