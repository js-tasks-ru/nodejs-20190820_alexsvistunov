const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('forbidden');
        return;
      }

      fs.stat(filepath, (err, stat) => {
        if (err) {
          console.log(err.message);

          res.statusCode = 404;
          res.end('not founded');
          return;
        }

        fs.unlink(filepath, (err) => {
          if (err) {
            res.statusCode = 501;
            res.end('Unknown error');
            console.log(err.message);
            return;
          }

          res.statusCode = 200;
          res.end('ok!');
        });
      });

      break;

    default:
      res.statusCode = 500;
      res.end('Not implemented');
  }
});

module.exports = server;
