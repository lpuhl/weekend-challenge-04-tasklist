var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/tasks_db';   // URI for the database


router.get('/', function (req, res) {
  // retrieve books from db
  // res.send({message: 'OK'});
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      console.log('cannot connect');
      res.sendStatus(500);
    }
    client.query('SELECT * FROM tasks', function (err, result) {
    done();
      if (err) {
        console.log('bad query');
        res.sendStatus(500);
      }
      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var task = req.body;
  console.log(task);
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('INSERT INTO tasks (description, completed)'
                + 'VALUES ($1, $2)',
              [task.description, task.complete],
              function (err, result) {
                done();
                if (err) {
                  res.sendStatus(500);
                }
                res.sendStatus(201);
              });
  });
});

router.put('/:id', function (req, res) {
  var id = req.params.id;
  var task = req.body;
  console.log(task);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      // console.log(err);
      res.sendStatus(500);
    }
    client.query('UPDATE tasks ' +
                  'SET description = $1, ' +
                  'target_date = $2 ' +
                  'WHERE id = $3',
                [task.description, task.target_date, id],
              function (err, result) {
                done();
                if (err) {
                  res.sendStatus(500);
                }
                res.sendStatus(201);
              });
  });
});

router.put('/complete/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.params.id);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      // console.log(err);
      res.sendStatus(500);
    }
    client.query('UPDATE tasks ' +
                  'SET completed = NOT completed ' +
                  'WHERE id = $1',
                [id],
              function (err, result) {
                done();
                if (err) {
                  res.sendStatus(500);
                }
                res.sendStatus(201);
              });
  });
});


router.delete('/:id', function (req, res) {
  var id = req.params.id;
  // console.log(id);
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    client.query('DELETE FROM tasks ' +
                'WHERE id = $1',
                [id],
              function (err, result) {
                done();
                if (err) {
                  res.sendStatus(500);
                }
                res.sendStatus(201);
              });
  });
});

module.exports = router;
