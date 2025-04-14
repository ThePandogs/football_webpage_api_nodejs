import { select, insert, update, remove } from '../models/team.js';
import { formatNameForQuery } from '../utils/format.js';

const selectTeams = async (req, res) => {

  const filters = {
    id: req.query.id ? parseInt(req.query.id) : null,
    name: req.query.name ? formatNameForQuery(req.query.name) : null,
    categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : null,
    categoryName: req.query.categoryName || null,
    genreId: req.query.genreId ? parseInt(req.query.genreId) : null,
    genreName: req.query.genreName || null,
    offset: req.query.offset ? parseInt(req.query.offset) : 0,
    limit: req.query.limit ? parseInt(req.query.limit) : 500
  };

  try {
    const teams = await select(filters);
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    return res.status(500).json({ message: 'Error fetching teams: ' + err.message });
  }
};

const insertTeam = async (req, res) => {
  const {
    name = null,
    categoryId = null,
    categoryName = null,
    genreId = null,
    genreName = null
  } = req.body;

  try {
    const team = await insert({ name, categoryId, categoryName, genreId, genreName });
    res.status(201).json(team);
  } catch (err) {
    return res.status(500).json({ message: 'Error inserting team: ' + err.message });
  }
};

const updateTeam = async (req, res) => {
  const id = req.params.id;
  const {
    name = null,
    categoryId = null,
    categoryName = null,
    genreId = null,
    genreName = null
  } = req.body;

  try {
    await update(id, { name, categoryId, categoryName, genreId, genreName });
    res.status(200).json({ message: 'Team updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating team: ' + err.message });
  }
};

const removeTeam = async (req, res) => {
  const id = req.query.id ? parseInt(req.query.id) : null;

  try {
    await remove(id);
    res.status(200).json({ message: 'Team removed' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting team: ' + err.message });
  }
};

export default {
  selectTeams,
  insertTeam,
  updateTeam,
  removeTeam,
};
