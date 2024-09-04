// server.js

const express = require('express');
const connection = require('./db.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileManager = require('express-fileupload');
const morgan = require('morgan');

// importing routes
const userSettingsRoutes = require('../routes/user-settings.js');

const app = express();
const port = 5174;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }))
app.use(cors({ origin: '*', credentials: true, }));
app.use(morgan('dev'));
app.use(fileManager());
app.use(bodyParser.json());
app.use('/', userSettingsRoutes);

app.listen(port, () => {
    console.log(`Server listens http://localhost:${port}`);
});
