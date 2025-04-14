import { query } from '../utils/db.js';

const select = async (filters) => {
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
    bornCity,
    offset = 0,
    limit = 500
  } = filters;

  try {
    const results = await query(
      'CALL players_select(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
        bornCity || null,
        offset,
        limit
      ]
    );
    return results[0] || [];
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const update = async (id, data) => {
  const {
    name,
    lastname,
    position_id,
    position_name,
    team_id,
    team_name,
    genre_id,
    genre_name,
    picture,
    birthdate,
    bornCity
  } = data;

  try {
    await query(
      'CALL players_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        name || null,
        lastname || null,
        position_id || null,
        position_name || null,
        team_id || null,
        team_name || null,
        genre_id || null,
        genre_name || null,
        picture || null,
        birthdate || null,
        bornCity || null
      ]
    );
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    throw err;
  }
};

const insert = async (data) => {
  const {
    name,
    lastname,
    position_id,
    position_name,
    team_id,
    team_name,
    genre_id,
    genre_name,
    picture,
    birthdate,
    bornCity
  } = data;

  try {
    const results = await query(
      'CALL players_insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name || null,
        lastname || null,
        position_id || null,
        position_name || null,
        team_id || null,
        team_name || null,
        genre_id || null,
        genre_name || null,
        picture || null,
        birthdate || null,
        bornCity || null
      ]
    );
    return { id: results.insertId, ...data };
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
