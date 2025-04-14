import { query } from '../utils/db.js';

const getAll = async () => {
    try {
        const results = await query('SELECT id, name, url, imageUrl, importance FROM sponsors');
        return results;
    } catch (err) {
        throw err; // Propaga el error para ser manejado en el controlador
    }
};

const getById = async (id) => {
    try {
        const results = await query('SELECT id, name, url, imageUrl, importance FROM sponsors WHERE id = ?', [id]);
        return results[0]; // Retorna el primer resultado
    } catch (err) {
        throw err;
    }
};

const getByImportance = async (importance) => {
    try {
        const results = await query('SELECT id, name, url, imageUrl, importance FROM sponsors WHERE importance = ?', [importance]);
        return results[0]; // Retorna el primer resultado
    } catch (err) {
        throw err;
    }
};

const create = async (data) => {
    const { name, url, imageUrl, importance } = data;
    try {
        const results = await query('INSERT INTO sponsors (name, url, imageUrl, importance) VALUES (?, ?, ?, ?)', [name, url, imageUrl, importance]);
        return { id: results.insertId, ...data }; // Retorna el nuevo patrocinador
    } catch (err) {
        throw err;
    }
};

const update = async (id, data) => {
    const { name, url, imageUrl, importance } = data;
    try {
        await query('UPDATE sponsors SET name = ?, url = ?, imageUrl = ?, importance = ? WHERE id = ?', 
            [name, url, imageUrl, importance, id]);
    } catch (err) {
        throw err;
    }
};

const remove = async (id) => {
    try {
        await query('DELETE FROM sponsors WHERE id = ?', [id]);
    } catch (err) {
        throw err;
    }
};

export {
    getAll,
    getById,
    getByImportance,
    create,
    update,
    remove,
};
