// db.js

const mysql = require('mysql');

// creating connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'teachers',
    connectionLimit: 10,
});

// connecting to db
connection.connect(err => {
    if (err) {
        console.error('Error while connecting to db: ', err.stack);
        return ;
    }
    console.log('Connected to db via id: ' + connection.threadId);
});

module.exports = connection;
