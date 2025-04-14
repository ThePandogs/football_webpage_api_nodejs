import { query } from '../utils/db.js';



const getUserByUsername = async (username) => {
    try {
        const results = await query('SELECT id, name, user, password FROM users WHERE user = ?', [username]);
        if (results.length === 0) {
           return null
        }
        return results[0]; 
    } catch (err) {
        throw err; 
    }
};

const createUser = async (name,username, password, role) => {

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await query('INSERT INTO users (name,username, password, role) VALUES (?, ?, ?)', [name,username, hashedPassword, role]);
        return { username, role }; // Devuelve el nuevo usuario creado
    } catch (err) {
        throw err; // Manejar errores (por ejemplo, si el usuario ya existe)
    }
};



export default {
    getUserByUsername,
    createUser, 
};
