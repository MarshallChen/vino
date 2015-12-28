import express from 'express';
import r from 'rethinkdb';

let connection = null;
const router = express.Router();

r.connect({
  host: 'localhost',
  port: 28015
}, (err, conn) => {
  if (err) throw err;
  connection = conn;
});

router
.route('/')
.get((req, res, next) => {
  let { query: { page }} = req;
  if (!page) page = 0;
  const perPage = 10;
  const DUMP = parseInt(page) + 1;
  r.db('architectures')
   .table('zeus')
   .orderBy({ index: r.desc('date') })
   .slice(page * perPage, DUMP * perPage)
   .run(connection, (err, cursor) => {
      if (err) res.status(500).send(err);
      cursor.toArray((error, projects) => {
        if (err) res.status(500).send(err);
        res.status(200).json(projects);
      })
    })
})

router
.route('/:id')
.get((req, res, next) => {
  let { params: { id }} = req;
  r.db('architectures')
   .table('zeus')
   .get(id)
   .run(connection, (err, project) => {
    if (err) res.status(500).send(err);
    res.status(200).json(project)
   })
})

export default router;