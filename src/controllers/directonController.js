import { select, insert, update, remove } from '../models/direction.js';
import { formatNameForQuery } from '../utils/format.js';

const selectDirectors = async (req, res) => {
    const filters = {
        id: req.query.id ? parseInt(req.query.id) : null,
        name: req.query.name ? formatNameForQuery(req.query.name) : null,
        lastname: req.query.lastname ? formatNameForQuery(req.query.lastname) : null,
        position: req.query.position || null,
        startDate: req.query.startDate || null,
        imageUrl: null,
        offset: req.query.offset ? parseInt(req.query.offset) : 0,
        limit: req.query.limit ? parseInt(req.query.limit) : 50
    };

    try {
        const directors = await select(filters);
        const formattedDirectors = directors.map(director => ({
            ...director,
            startDate: director.startDate ? new Date(director.startDate).toISOString().split('T')[0] : null
        }));

        res.json(formattedDirectors);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching directors' });
    }
};


const insertDirector = async (req, res) => {
    const { name, lastname, position, startDate, imageUrl } = req.body;

    if (!name || !lastname || !position || !startDate || !imageUrl) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        await insert({ name, lastname, position, startDate, imageUrl });
        res.status(201).json({ message: 'Director inserted' });
    } catch (err) {
        return res.status(500).json({ message: 'Error inserting director: ' + err.message });
    }
};

const updateDirector = async (req, res) => {
    const id = req.params.id;
    const { name, lastname, position, startDate, imageUrl } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Director ID is required' });
    }

    try {
        await update(parseInt(id), { name, lastname, position, startDate, imageUrl });
        res.status(200).json({ message: 'Director updated' });
    } catch (err) {
        return res.status(500).json({ message: 'Error updating director' });
    }
};

const removeDirectorById = async (req, res) => {
    const filters = {
        id: parseInt(req.params.id)
    };

    try {
        await remove(filters);
        res.status(200).json({ message: 'Director deleted' });
    } catch (err) {
        return res.status(500).json({ message: `Error deleting director: ${err.message}` });
    }
};

const removeDirectorsByFilters = async (req, res) => {
    const filters = req.body;

    try {
        await remove(filters);
        res.status(200).json({ message: 'Directors deleted' });
    } catch (err) {
        return res.status(500).json({ message: `Error deleting directors: ${err.message}` });
    }
};

export default {
    selectDirectors,
    insertDirector,
    updateDirector,
    removeDirectorById,
    removeDirectorsByFilters
};
