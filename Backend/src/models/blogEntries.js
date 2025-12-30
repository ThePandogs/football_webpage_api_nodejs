import { query, extractInsertId } from '../utils/db.js';

const select = (params, callback) => {
  const clauses = [];
  const values = [];

  if (params.id) { clauses.push('b.id = ?'); values.push(params.id); }
  if (params.user) { clauses.push('(u.username = ? OR u.email = ? OR u.[user] = ?)'); values.push(params.user, params.user, params.user); }
  if (params.title) { clauses.push('b.title LIKE ?'); values.push(`%${params.title}%`); }
  if (params.content) { clauses.push('b.content LIKE ?'); values.push(`%${params.content}%`); }
  if (params.resource) { clauses.push('b.resource LIKE ?'); values.push(`%${params.resource}%`); }
  if (params.visible !== undefined && params.visible !== null) { clauses.push('b.visible = ?'); values.push(params.visible ? 1 : 0); }
  if (params.date_create) { clauses.push('CONVERT(DATE, b.date_create) = CONVERT(DATE, ?)'); values.push(params.date_create); }

  const offset = params.offset ? parseInt(params.offset) : 0;
  const limite = params.limite ? parseInt(params.limite) : 100;

  let sql = 'SELECT b.*, u.username FROM blog_entries b LEFT JOIN users u ON b.userId = u.id';
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  sql += ' ORDER BY b.id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY';
  values.push(offset, limite);

  query(sql, values, (err, results) => {
    if (err) return callback(err);
    // results puede ser un array directo o un array anidado dependiendo del driver
    const entries = Array.isArray(results) ? (Array.isArray(results[0]) ? results[0] : results) : [];
    return callback(null, entries);
  });
};


const insert = (data, callback) => {
  const { user, title, content, resource, visible } = data;

  query('SELECT id FROM users WHERE username = ? OR email = ? OR [user] = ? LIMIT 1', [user, user, user], async (err, rows) => {
    try {
      if (err) return callback(err);
      const userId = (rows && rows[0] && rows[0].id) ? rows[0].id : null;
      const results = await query('INSERT INTO blog_entries (userId, title, content, resource, visible) VALUES (?, ?, ?, ?, ?); SELECT SCOPE_IDENTITY() AS insertId;', [userId, title, content, resource, visible ? 1 : 0]);
      const inserted = extractInsertId(results);
      callback(null, { id: inserted || null, ...data });
    } catch (e) {
      callback(e);
    }
  });
};


const update = async (id, data, callback) => {
  const { user, title, content, resource, visible } = data;
  try {
    let userId = null;
    if (user) {
      const rows = await query('SELECT id FROM users WHERE username = ? OR email = ? OR [user] = ? LIMIT 1', [user, user, user]);
      userId = (rows && rows[0] && rows[0].id) ? rows[0].id : null;
    }

    await query('UPDATE blog_entries SET userId = COALESCE(?, userId), title = COALESCE(?, title), content = COALESCE(?, content), resource = COALESCE(?, resource), visible = COALESCE(?, visible) WHERE id = ?', [userId, title, content, resource, (visible !== undefined && visible !== null) ? (visible ? 1 : 0) : null, id]);
    callback(null);
  } catch (err) {
    callback(err);
  }
};


const remove = async (id, callback) => {
  try {
    await query('DELETE FROM blog_entries WHERE id = ?', [id]);
    callback(null);
  } catch (err) {
    callback(err);
  }
};

export {
  select,
  insert,
  update,
  remove,
};
