var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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
  res.status(req.params.s).end();
});

app.all('/headers', function (req, res) {
  var body = {};
  (req.query.headers || []).forEach(function (h) {
    body[h] = req.header(h);
  });
  res.status(200).send(body);
});

app.all('/query', function (req, res) {
  var body = {};
  for (var name in req.query) {
    body[name] = req.query[name];
  }
  res.status(200).json(body);
})

app.all('/pending', function (req, res) {
  var timeout = 2000;
  try {
    timeout = parseInt(req.query.timeout, 10);
  } catch (e) {}

  setTimeout(function () {
    res.status(200).end();
  }, timeout);
});

app.get('/users', function (req, res) {
  res.status(200).json(users);
});

app.post('/users', function (req, res) {
  if (typeof req.body === 'object' && req.body.name) {
    req.body.id = ++id;
    users.push(req.body);
    res.status(201).json(req.body);
  } else {
    res.status(403).end();
  }
});

app.get('/users/:id', function (req, res) {
  try {
    var id = parseInt(req.params.id, 10);
    var user = find(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(403).send('Invalid ID');
  }
})

app.listen(3000, function () {
  console.log('Example server listening at port 3000');
});
