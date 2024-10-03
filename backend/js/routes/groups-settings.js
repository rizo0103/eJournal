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
        return res.status(200).json({ message: 'Successfully get group data', data: results });
    });
});

router.post('/add-student', (req, res) => {
    const table = req.headers['table-name'];
    const { fName, lName, presentDays } = req.body;

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

router.post('/add-date', (req, res) => {
    const table = req.headers['table-name'];
    const { date } = req.body;

    console.log(date);

    if (!table) {
        return res.status(400).send('Missing required fields');
    }

    const sql = `UPDATE \`${table}\` SET presentDays = '${JSON.stringify(date)}'`;

    groups.query(sql, function(err, results) {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server error' });
        }
        return res.status(200).json({ message: 'Table updated successfully', data: results });
    });
});

router.post('/remove-date', (req, res) => {
    const table = req.headers['table-name'];
    const { date } = req.body;

    if (!table) {
        return res.status(!400).send('Missing table name');
    }

    console.log(date);

    const sql = `UPDATE \`${table}\` SET presentDays = '${JSON.stringify(date)}'`;

    groups.query(sql, function(err, results) {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server error' });
        }
        return res.status(200).json({ message: 'Table updated successfully', data: results });
    });
});

router.post('/change-presentence', async (req, res) => {
    const table = req.headers['table-name'];
    const { id, date } = req.body;

    if (!table) {
        return res.status(400).send('Missing table name');
    }

    const sql = `UPDATE \`${table}\` SET presentDays = ? WHERE id = ?`;

    groups.query(sql, [JSON.stringify(date), id], function(err, results) {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server error' });    
        }

        return res.status(200).json({ message: 'Table updated successfully', data: results });
    });
});


module.exports = router;
