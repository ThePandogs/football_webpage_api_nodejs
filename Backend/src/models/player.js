import { query, extractInsertId } from '../utils/db.js';

const select = async (filters) => {
  const {
    id,
    name,
    position,
    dorsal,
    status,
    offset = 0,
    limit = 500
  } = filters;

  try {
    const clauses = [];
    const values = [];
    if (id) { clauses.push('id = ?'); values.push(id); }
    if (name) { clauses.push('name LIKE ?'); values.push(`%${name}%`); }
    if (position) { clauses.push('position = ?'); values.push(position); }
    if (dorsal) { clauses.push('dorsal = ?'); values.push(dorsal); }
    if (status) { clauses.push('status = ?'); values.push(status); }

    let sql = 'SELECT * FROM players';
    if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
    sql += ' ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY';
    values.push(offset); values.push(limit);

    const results = await query(sql, values);
    return results[0] || [];
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};
const update = async (id, data) => {
  const { name, position, dorsal, status } = data;

  try {
    await query(
      'UPDATE players SET name = COALESCE(?, name), position = COALESCE(?, position), dorsal = COALESCE(?, dorsal), status = COALESCE(?, status) WHERE id = ?',
      [name || null, position || null, dorsal || null, status || null, id]
    );
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const insert = async (data) => {
  const { name, position, dorsal, status } = data;

  try {
    const results = await query('INSERT INTO players (name, position, dorsal, status) VALUES (?, ?, ?, ?); SELECT SCOPE_IDENTITY() AS insertId;', [name || null, position || null, dorsal || null, status || null]);
    const inserted = extractInsertId(results);
    return { id: inserted || null, ...data };
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const remove = async (filters) => {
  const {
    id,
    name,
    lastname,
    position_id,
    position_name,
    team_id,
    team_name,
    genre_id,
    genre_name,
    birthdate,
    bornCity
  } = filters;

  try {
    await query(
      'CALL players_delete(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id || null,
        name || null,
        lastname || null,
        position_id || null,
        position_name || null,
        team_id || null,
        team_name || null,
        genre_id || null,
        genre_name || null,
        birthdate || null,
        bornCity || null
      ]
    );
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

export {
  select,
  update,
  insert,
  remove
};
