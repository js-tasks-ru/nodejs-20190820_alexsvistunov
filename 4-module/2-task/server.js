const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {parse} = require('querystring');

const FILE_LIMIT = 1e6;

const server = new http.Server();

const writeFile = (path, data, response) => {
  fs.writeFile(path, data, {flag: 'wx'}, (err) => {
    if (err) {
      response.end(err.message);
      return;
    }

    response.statusCode = 201;
    response.end(`ok!`);
  });
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filesDirectoryPath = path.join(__dirname, 'files');
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('forbidden');
        return;
      }

      if (+req.headers['content-length'] > FILE_LIMIT) {
        res.statusCode = 413;
        res.end('body is too big!');
        return;
      }

      let body = '';
      let size = 0;

      req.on('data', (chunk) => {
        if (size > FILE_LIMIT) {
          res.statusCode = 413;
          res.end('body is too big!');
        } else {
          body += chunk.toString();
          size += chunk.length;
        }
      });

      req.on('end', () => {
        fs.stat(filesDirectoryPath, (err, stat) => {
          if (err) {
            fs.mkdir(filesDirectoryPath, (err) => {
              if (err) throw err;

              writeFile(filepath, JSON.stringify(parse(body)), res);
            });
          } else {
            fs.stat(filepath, (err, stats) => {
              if (err) {
                writeFile(filepath, JSON.stringify(parse(body)), res);
              } else {
                res.statusCode = 409;
                res.end('File already existed!');
              }
            });
          }
        });
      });

      req.on('error', (err) => {
        console.log(err.message);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
