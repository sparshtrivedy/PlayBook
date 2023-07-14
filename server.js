const express = require('express');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const pool = new Pool ({
    user: 'sparshtrivedy',
    host: 'localhost',
    database: 'SportsManagement',
    password: 'Sparsh@2140',
    port: 5532
});

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Define a route


app.post('/login', async (req, res) => {
    const { username, password} = req.body;

    // Replace this with your actual user authentication logic
    const result = await pool.query("SELECT * FROM Users WHERE UserName = $1 AND Password = $2", [username, password]);
    const user = result.rows[0]

    if (user) {
        const token = jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });

        res.json({ user, token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token)
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      console.log(decoded)
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }
};

app.get('/', (req, res) => {
    pool.query('SELECT * FROM Users', (err, result) => {
        if (err) {
          console.error('Error executing query', err);
          res.status(500).send('Error retrieving users');
        } else {
          res.json(result.rows);
        }
    });
});

app.put('/update-user', authenticateJWT, async (req, res) => {
    const id = req.user.username;
    const { username, email, password, firstname, lastname } = req.body;

    // Replace this with your actual user authentication logic

    pool.query('UPDATE Users SET username = $1, email = $2, password = $3, firstname = $4, lastname = $5 WHERE username = $6', [username, email, password, firstname, lastname, id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`User modified with username: ${id}`)
    });
});

// Start the server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
