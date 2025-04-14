import { query } from '../utils/db.js';

// Seleccionar equipos con filtros
const select = async (filters) => {
  const { id, name = null, category = null, genre = null, offset = 0, limit = 500 } = filters;

  try {
    const results = await query(
      'CALL teams_select(?, ?, ?, ?, ?, ?)', 
      [id || null, name || null, category || null, genre || null, offset, limit]
    );
    return results[0] || [];
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const insert = async (data) => {
  const { name, category, genre } = data;

  try {
    const results = await query(
      'CALL teams_insert(?, ?, ?)', 
      [name || null, category || null, genre || null]
    );
    return { id: results.insertId, ...data };
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const update = async (id, data) => {
  const { name, categoryId, categoryName, genreId, genreName } = data;

  try {
    await query(
      'CALL teams_update(?, ?, ?, ?, ?, ?)',
      [id, name || null, categoryId || null, categoryName || null, genreId || null, genreName || null]
    );
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const remove = async (filters) => {
  const { id, name, categoryId, categoryName, genreId, genreName } = filters;

  try {
    await query(
      'CALL teams_delete(?, ?, ?, ?, ?, ?)',
      [id || null, name || null, categoryId || null, categoryName || null, genreId || null, genreName || null]
    );
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
