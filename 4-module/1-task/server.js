const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end(`Error ${res.statusCode}: forbidden`);
        return;
      }

      fs.readFile(filepath, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end(`Error ${res.statusCode}: not found`);
          return;
        }

        res.statusCode = 200;
        res.end(data.toString());
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
