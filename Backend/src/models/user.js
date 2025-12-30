import { query } from '../utils/db.js';
import bcrypt from 'bcrypt';



const getUserByUsername = async (username) => {
    try {
        const results = await query('SELECT id, name, username, [user], password, role FROM users WHERE username = ? OR [user] = ?', [username, username]);
        if (!results || results.length === 0) {
           return null;
        }
        // Normalize to have username property
        const user = results[0];
        if (!user.username && user.user) user.username = user.user;
        return user; 
    } catch (err) {
        throw err; 
    }
};

const createUser = async (username, password, role = 'user', name = null) => {

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await query('INSERT INTO users (name, username, [user], password, role) VALUES (?, ?, ?, ?, ?)', [name, username, username, hashedPassword, role]);
        return { username, role }; // Devuelve el nuevo usuario creado
    } catch (err) {
        throw err; // Manejar errores (por ejemplo, si el usuario ya existe)
    }
};



export default {
    getUserByUsername,
    createUser, 
};
