// user-settings.js

const express = require('express');
const router = express();
const jwt = require('jsonwebtoken');
const connection = require('../database/teachers');

const img_dir = '../../../eJournal/public/images/';

// getting all users
router.get('/get-users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Request execution error');
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// adding new user
router.post('/add-user', (req, res) => {
    const { fName, lName, username, email, password} = req.body;
    if (!req.files || !req.files.file) {
        const avatar = 'defaultAvatar.jpg';
        
        const sql = `INSERT INTO users(fName, lName, avatar, username, password, email) VALUES('${fName}', '${lName}', '${avatar}', '${username}', '${password}', '${email}')`;
        
        connection.query(sql, (error) => {
            if (error) {
                console.error('Request execution error: ', error);
                return res.status(500).send('Server error');
            }
            res.status(201).json({ message: 'User added successfully' });
        });
        return ;
    }
    const avatar = `${username}-${req.files.file.name}`;

    req.files.file.mv(img_dir + `${username}-${req.files.file.name}`);
    // console.log(req.files.file);

    const sql = `INSERT INTO users(fName, lName, avatar, username, password, email) VALUES('${fName}', '${lName}', '${avatar}', '${username}', '${password}', '${email}')`;
    
    connection.query(sql, (error) => {
        if (error) {
            console.error('Request execution error: ', error);
            return res.status(500).send('Server error');
        }
        res.status(201).json({ message: 'User added successfully' });
    });
});

router.post('/login-user', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

    connection.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            console.log('User was not found');
            return res.status(404).json({ message: 'User was not found' });
        }

        // console.log(results);
        const token = jwt.sign({ id: results[0].id }, 'your_jwt_secret', { expiresIn: '10h' });
        return res.status(200).json({ message: 'Successfully logged in', access_token: token });
    });
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user; 
        next(); 
    });
};

router.get('/get-user-data', authenticateToken, (req, res) => {
    const sql = `SELECT * FROM users WHERE id = ${req.user.id}`;
    
    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            console.log('User was not found');
            return res.status(404).json({ message: 'User was not found' });
        }

        return res.status(200).json({ message: 'Successfully logged in', data: results });
    });
    // res.json({ message: 'Successfully got user`s data', user: req.user.id });
});

router.post('/add-groups', (req, res) => {
    const { groups, username } = req.body;
    const sql = `UPDATE users SET groups = '${groups}' WHERE username = '${username}'`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json('Server error');
        }
        return res.status(200).json({ message: 'Groups were successfully added', data: results });
    });
});

module.exports = router;
