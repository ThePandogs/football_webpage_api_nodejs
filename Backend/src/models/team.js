import { query, extractInsertId } from '../utils/db.js';

// Seleccionar equipos con filtros (compatible con SQL Server y MySQL)
const select = async (filters) => {
  const { id, name = null, category = null, genre = null, offset = 0, limit = 500 } = filters;

  try {
    const clauses = [];
    const values = [];
    if (id) { clauses.push('id = ?'); values.push(id); }
    if (name) { clauses.push('name LIKE ?'); values.push(`%${name}%`); }
    if (category) { clauses.push('categoryName LIKE ?'); values.push(`%${category}%`); }
    if (genre) { clauses.push('genreName LIKE ?'); values.push(`%${genre}%`); }

    let sql = 'SELECT * FROM teams';
    if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
    sql += ' ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY';
    values.push(offset); values.push(limit);

    console.log('TEAM SELECT SQL:', sql, 'VALUES:', values);
    const results = await query(sql, values);
    console.log('TEAM SELECT RESULTS:', results);
    return results || [];
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const insert = async (data) => {
  const { name, category, genre } = data;

  try {
    const results = await query(
      'INSERT INTO teams (name, categoryName, genreName) VALUES (?, ?, ?); SELECT SCOPE_IDENTITY() AS insertId;',
      [name || null, category || null, genre || null]
    );
    const inserted = extractInsertId(results);
    return { id: inserted || null, ...data };
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const update = async (id, data) => {
  const { name, categoryId, categoryName, genreId, genreName } = data;

  try {
    await query(
      'UPDATE teams SET name = COALESCE(?, name), categoryId = COALESCE(?, categoryId), categoryName = COALESCE(?, categoryName), genreId = COALESCE(?, genreId), genreName = COALESCE(?, genreName) WHERE id = ?',
      [name || null, categoryId || null, categoryName || null, genreId || null, genreName || null, id]
    );
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const remove = async (filters) => {
  const { id, name, categoryId, categoryName, genreId, genreName } = filters;

  try {
    const clauses = [];
    const values = [];
    if (id) { clauses.push('id = ?'); values.push(id); }
    if (name) { clauses.push('name = ?'); values.push(name); }
    if (categoryId) { clauses.push('categoryId = ?'); values.push(categoryId); }
    if (categoryName) { clauses.push('categoryName = ?'); values.push(categoryName); }
    if (genreId) { clauses.push('genreId = ?'); values.push(genreId); }
    if (genreName) { clauses.push('genreName = ?'); values.push(genreName); }

    let sql = 'DELETE FROM teams';
    if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');

    await query(sql, values);
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

export {
  select,
  insert,
  update,
  remove
};
