import { query, extractInsertId } from '../utils/db.js';

const select = async (filters) => {
    const {
        id,
        name,
        lastname,
        position,
        startDate,
        imageUrl,
        offset = 0,
        limit = 500
    } = filters;

    try {
        const results = await query(
            'CALL direction_select(?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id || null,
                name || null,
                lastname || null,
                position || null,
                startDate || null,
                imageUrl || null,
                offset,
                limit
            ]
        );
        return results[0] || [];
    } catch (err) {
        console.error('Error executing the query:', err);
        throw err;
    }
};


const update = async (id, data) => {
    const {
        name,
        lastname,
        position,
        startDate,
        imageUrl
    } = data;

    try {
        await query(
            'CALL direction_update(?, ?, ?, ?, ?, ?)',
            [
                id,
                name || null,
                lastname || null,
                position || null,
                startDate || null,
                imageUrl || null
            ]
        );
    } catch (err) {
        console.error('Error executing the query:', err);
        throw err;
    }
};

const insert = async (data) => {
    const {
        name,
        lastname,
        position,
        startDate,
        imageUrl
    } = data;

    try {
        const results = await query(
            'CALL direction_insert(?, ?, ?, ?, ?)',
            [
                name || null,
                lastname || null,
                position || null,
                startDate || null,
                imageUrl || null
            ]
        );
        const inserted = extractInsertId(results);
        return { id: inserted || null, ...data };
    } catch (err) {
        console.error('Error executing the query:', err);
        throw err;
    }
};

const remove = async (filters) => {
    const {
        id,
        name,
        lastname,
        position,
        startDate,
        imageUrl
    } = filters;

    try {
        await query(
            'CALL direction_delete(?, ?, ?, ?, ?, ?)',
            [
                id || null,
                name || null,
                lastname || null,
                position || null,
                startDate || null,
                imageUrl || null
            ]
        );
    } catch (err) {
        console.error('Error executing the query:', err);
        throw err;
    }
};

export {
    select,
    update,
    insert,
    remove
};
