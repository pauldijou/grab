var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer')();
var cors = require('cors');
var app = express();

app.use(cors());

app.options('*', cors());

var parseJSON = bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });

app.use(function(req, res, next){
  if ((req.header('Content-Type') || req.header('content-type')) === 'application/json') {
    parseJSON(req, res, next);
  } else if ((req.header('Content-Type') || req.header('content-type')) === 'application/x-www-form-urlencoded') {
    parseUrlencoded(req, res, next);
  } else if ((req.header('Content-Type') || req.header('content-type') || '').indexOf('multipart/form-data') >= 0) {
    multer.array()(req, res, next);
  } else {
    req.body = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
      req.body += chunk;
    });

    req.on('end', function() {
      next();
    });
  }
});

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '..', 'dist')));

var id = 0;

var users = [
  {id: ++id, name: 'Paul'},
  {id: ++id, name: 'Alexandre'}
];

function find(id) {
  return users.reduce(function (res, user) {
    if (user.id === id) {
      res = user;
    }
    return res;
  }, undefined);
}

app.all('/status/:s', function (req, res) {
  console.log(req.method, '/status/'+req.params.s);
  res.status(req.params.s).end();
});

app.all('/body', function (req, res) {
  console.log(req.method, '/body', req.body);
  res.status(200).send(req.body);
});

app.all('/headers', function (req, res) {
  console.log(req.method, '/headers', req.query);
  var body = {};
  for (var header in req.query) {
    body[header] = req.header(header);
  }
  res.status(200).send(body);
});

app.all('/query', function (req, res) {
  console.log(req.method, '/query', req.query);
  var body = {};
  for (var name in req.query) {
    body[name] = req.query[name];
  }
  res.status(200).json(body);
})

app.all('/pending', function (req, res) {
  console.log(req.method, '/pending', req.query.timeout || 2000, 'ms');
  var timeout = parseInt(req.query.timeout, 10);
  if (isNaN(timeout)) {
    timeout = 2000;
  }
  setTimeout(function () {
    res.status(200).end();
  }, timeout);
});

app.get('/users', function (req, res) {
  console.log('GET', '/users');
  res.status(200).json(users);
});

app.post('/users', function (req, res) {
  console.log('POST', '/users', req.body);
  if (typeof req.body === 'object' && req.body.name) {
    req.body.id = ++id;
    users.push(req.body);
    res.status(201).json(req.body);
  } else {
    res.status(400).end();
  }
});

app.get('/users/:id', function (req, res) {
  console.log('GET', '/users/'+req.params.id);
  try {
    var id = parseInt(req.params.id, 10);
    var user = find(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).send('Invalid ID');
  }
})

app.listen(3000, function () {
  console.log('Example server listening at port 3000');
});
