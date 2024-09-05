const express = require('express');
const router = express();
const groups = require('../database/groups.js');

router.get('/get-group-data', (req, res) => {
    const tableName = req.headers['table-name'];

    if (!tableName) {
        return res.status(400).json({ error: 'Table name required in headers.' });
    }

    const query = `SELECT * FROM \`${tableName}\``;

    groups.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json(results);
    });
});

router.post('/add-student', (req, res) => {
    const table = req.headers['table-name'];
    const { fName, lName, presentDays } = req.body;
    // const fName = 'rizo';
    // const lName = 'shokiri';
    // const presentDays = {
    //     semester1: {
    //         september: [1, 2, 3],
    //     },
    // };

    if (!table || !fName || !lName || !presentDays) {
        return res.status(400).send('Missing required fields');
    }

    const sql = `INSERT INTO \`${table}\`(fName, lName, presentDays) VALUES ('${fName}', '${lName}', '${JSON.stringify(presentDays)}')`;

    groups.query(sql, (error) => {
        if (error) {
            console.error('Request execution error: ', error);
            return res.status(500).send('Server error');
        }
        return res.status(201).json({ message: 'Table updated successfully' });
    });
});


module.exports = router;
