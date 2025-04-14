import { query } from '../utils/db.js';

const select = (params, callback) => {

  let sql = 'CALL blog_entries_select(?, ?, ?, ?, ?, ?,?,?,?)';
  const values = [
    params.id || null,
    params.user || null,
    params.title || null,
    params.content || null,
    params.resource || null,
    params.visible || null,
    params.date_create || null,
    params.offset || null,
    params.limite || null
  ];

  query(sql, values, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};


const insert = (data, callback) => {
  const { user, title, content, resource, visible } = data;
  query(
    `CALL blog_entries_insert(?, ?, ?, ?, ?)`,
    [user, title, content, resource, visible],
    (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, { id: results[0].insertId, ...data });
    }
  );
};


const update = (id, data, callback) => {
  const { user, title, content, resource, visible } = data;
  query(
    `CALL blog_entries_update(?, ?, ?, ?, ?, ?)`,
    [id, user, title, content, resource, visible],
    (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    }
  );
};


const remove = (id, callback) => {
  query(`CALL blog_entries_delete(?)`, [id], (err) => {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};

export {
  select,
  insert,
  update,
  remove,
};
