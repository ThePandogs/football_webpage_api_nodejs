import { compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg; 
import userModel from '../models/user.js';

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'User or password incorrect' });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'User or password incorrect' });
        }

        const token = sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (err) {
        return res.status(500).json({ error: 'Error during login' });
    }
};

const createUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const newUser = await userModel.createUser(username, password, role);
        res.status(201).json({ message: 'User created', user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

export default {
    login,
    createUser,
};
