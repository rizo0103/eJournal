// groups.js

const mysql = require('mysql');

// creating connection
const groups = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'groups',
    connectionLimit: 10,
});

// connecting to db
groups.connect(err => {
    if (err) {
        console.error('Error ocurred while connecting to db: ', err.stack);
        return ;
    }
    
    console.log('Connected to groups db via id: ', groups.threadId);
});

module.exports = groups;
