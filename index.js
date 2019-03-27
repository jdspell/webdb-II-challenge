const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3',
    }
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.post('/api/zoos', (req, res) => {
  db('zoos')
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db('zoos')
        .where({ id })
        .first()
        .then(zoo => {
          res.status(200).json(zoo);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


server.get('/api/zoos', (req, res) => {
  db('zoos')
      .then(zoos => {
          res.status(200).json(zoos);
      })
      .catch(error => {
          res.status(500).json(error);
      });
});


server.get('/api/zoos/:id', (req, res) => {
  const zooId = req.params.id;

  db('zoos')
    .where({ id: zooId })
    .first()
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.delete('/api/zoos/:id', (req, res) => {
  const zooId = req.params.id;

  db('zoos')
    .where({ id: zooId })
    .del()
    .then(count => {
      if(count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "Could not delete zoo." });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.put('/api/zoos/:id', (req, res) => {
  const zooId = req.params.id;
  const updatedZoo = req.body;

  db('zoos')
    .where({ id: zooId })
    .update(updatedZoo)
    .then(count => {
      if(count) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "Could not update zoo." });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


const port = 3301;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
