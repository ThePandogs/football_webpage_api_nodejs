import { select, insert, update, remove } from '../models/player.js';
import { formatNameForQuery } from '../utils/format.js';

const selectPlayers = async (req, res) => {
  const filters = {
    id: req.query.id ? parseInt(req.query.id) : null,
    name: req.query.name ? formatNameForQuery(req.query.name) : null,
    lastname: req.query.lastname ? formatNameForQuery(req.query.lastname) : null,
    position_id: req.query.position_id ? parseInt(req.query.position_id) : null,
    position_name: req.query.position_name ? formatNameForQuery(req.query.position_name) : null,
    team_id: req.query.team_id ? parseInt(req.query.team_id) : null,
    team_name: req.query.team_name ? formatNameForQuery(req.query.team_name) : null,
    genre_id: req.query.genre_id ? parseInt(req.query.genre_id) : null,
    genre_name: req.query.genre_name ? formatNameForQuery(req.query.genre_name) : null,
    birthdate: req.query.birthdate || null,
    bornCity: req.query.bornCity || null,
    offset: req.query.offset ? parseInt(req.query.offset) : 0,
    limit: req.query.limit ? parseInt(req.query.limit) : 50
  };

  try {
    const players = await select(filters);

    const formattedPlayers = players.map(player => ({
      ...player,
      birthdate: player.birthdate ? new Date(player.birthdate).toISOString().split('T')[0] : null
    }));

    res.json(formattedPlayers);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching players' });
  }
};

const insertPlayer = async (req, res) => {
  const { name, lastname, position, team, picture, genre, birthdate, bornCity } = req.body;

  if (!name || !lastname || !position || !team || !picture || !genre || !birthdate || !bornCity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await insert({ name, lastname, position, team, picture, genre, birthdate, bornCity });
    res.status(201).json({ message: 'Player inserted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error inserting player: ' + err.message });
  }
};

const updatePlayer = async (req, res) => {
  const id = req.params.id;
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
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Player ID is required' });
  }

  try {
    await update(parseInt(id), {
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
    });
    res.status(200).json({ message: 'Player updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating player' });
  }
};

const removePlayerById = async (req, res) => {
  const filters = {
    id: parseInt(req.params.id)
  };

  try {
    await remove(filters);
    res.status(200).json({ message: 'Player deleted' });
  } catch (err) {
    return res.status(500).json({ message: `Error deleting player: ${err.message}` });
  }
};

const removePlayersByFilters = async (req, res) => {
  const filters = req.body;

  try {
    await remove(filters);
    res.status(200).json({ message: 'Players deleted' });
  } catch (err) {
    return res.status(500).json({ message: `Error deleting players: ${err.message}` });
  }
};

export default {
  selectPlayers,
  insertPlayer,
  updatePlayer,
  removePlayerById,
  removePlayersByFilters
};
