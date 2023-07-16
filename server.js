const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const bodyParser = require('body-parser');

require("dotenv").config();

const { Pool } = require('pg');

const pool = new Pool ({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.post('/login', async (req, res) => {
    const { username, password} = req.body;

    // Replace this with your actual user authentication logic
    const result = await pool.query("SELECT * FROM Users WHERE username = $1 AND password = $2", [username, password]);
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
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }
};

app.get('/users', (req, res) => {
  pool.query('SELECT * FROM Users', (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/teams', (req, res) => {
  pool.query('SELECT Team.*, Users.username, Users.firstname, Users.lastname FROM Team JOIN Users ON Team.UID=Users.UID', (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/venues', (req, res) => {
  pool.query('SELECT * FROM VENUE', (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/games', (req, res) => {
  pool.query('SELECT CAST(g.date AS CHAR(10)), g.sport, g.start_time, g.end_time, v.name as venue, v.vid, v.city, v.capacity, t.name as home, t.tid as home_tid, t1.name as away, t1.tid as away_tid FROM Game g JOIN Venue v ON g.vid=v.vid JOIN Plays p ON g.date=p.date JOIN Team t ON t.tid=p.home_tid JOIN Team t1 ON t1.tid=p.away_tid', (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/games/:date', (req, res) => {
  const date = req.params['date'];
  pool.query('SELECT CAST(g.date AS CHAR(10)), g.sport, g.start_time, g.end_time, v.name as venue, v.city, v.capacity, t.name as home, t1.name as away FROM Game g JOIN Venue v ON g.vid=v.vid JOIN Plays p ON g.date=p.date JOIN Team t ON t.tid=p.home_tid JOIN Team t1 ON t1.tid=p.away_tid WHERE g.date = $1', [date], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.put('/update-game', async (req, res) => {
  const { date, sport, start_time, end_time, vid, home_tid, away_tid} = req.body;

  try {
    // First SQL statement
    const updateGameResult = await pool.query('UPDATE Game SET sport=$1, start_time=$2, end_time=$3, vid=$4 WHERE date=$5', [sport, start_time, end_time, vid, date]);
  
    // Second SQL statement
    const updatePlaysResult = await pool.query('UPDATE Plays SET home_tid=$2, away_tid=$3 WHERE date=$1', [date, home_tid, away_tid]);
  
    res.json({ gameResult: updateGameResult.rows, playsResult: updatePlaysResult.rows });
  } catch (err) {
    console.error('Error executing queries', err);
    res.status(500).send('Error updating database');
  }
});

app.put('/add-game', async (req, res) => {
  const { date, sport, start_time, end_time, vid, home_tid, away_tid} = req.body;

  try {
    // First SQL statement
    const addGameResult = await pool.query('INSERT INTO Game VALUES ($1, $2, $3, $4, $5)', [date, vid, sport, start_time, end_time]);
  
    // Second SQL statement
    const addPlaysResult = await pool.query('INSERT INTO Plays VALUES ($1, $2, $3)', [home_tid, away_tid, date]);
  
    res.json({ gameResult: addGameResult.rows, playsResult: addPlaysResult.rows });
  } catch (err) {
    console.error('Error executing queries', err);
    res.status(500).send('Error inserting into database');
  }
});

app.get('/players/:tid', (req, res) => {
  const tid = req.params['tid'];

  pool.query('SELECT * FROM Player WHERE TID = $1', [tid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving players');
      } else {
        res.json(result.rows);
      }
  });
});

app.post('/add-player/:tid', (req, res) => {
  const pid = uuidv4(); 
  const tid = req.params['tid'];
  const {firstname, lastname, number} = req.body;

  pool.query('INSERT INTO Player VALUES ($1, $2, $3, $4, $5)', [pid, tid, firstname, lastname, number], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving players');
      } else {
        res.json(result.rows);
      }
  });
});

app.put('/update-player/:pid', (req, res) => {
  const pid = req.params['pid'];
  const {firstname, lastname, number, tid} = req.body;
  console.log(req.body)
  pool.query('UPDATE Player SET firstname = $1, lastname = $2, number = $3, TID = $4 WHERE PID = $5', [firstname, lastname, number, tid, pid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving players');
      } else {
        res.json(result.rows);
      }
  });
});

app.post('/add-user', (req, res) => {
  const uid = uuidv4(); 
  const { username, email, password, firstname, lastname, role } = req.body;

  pool.query("INSERT INTO Users VALUES ($1, $2, $3, $4, $5, $6, $7)", [uid, username, firstname, lastname, email, password, role], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`User added with id: ${uid}`)
  });
});

app.post('/add-team', (req, res) => {
  const tid = uuidv4(); 
  const { uid, city, name, win_rate } = req.body;
  
  console.log(tid)

  pool.query("INSERT INTO Team VALUES ($1, $2, $3, $4, $5)", [tid, uid, city, name, win_rate], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Team added with id: ${tid}`)
  });
});

app.put('/update-user', (req, res) => {
    const uid = req.body.uid;
    const { username, email, password, firstname, lastname, role } = req.body;

    pool.query('UPDATE Users SET username = $1, email = $2, password = $3, firstname = $4, lastname = $5, role = $6 WHERE UID = $7', [username, email, password, firstname, lastname, role, uid], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`User modified with id: ${uid}`)
    });
});

app.put('/delete-user', authenticateJWT, async (req, res) => {
  const uid = req.user.UID;

  pool.query('DELETE FROM Users WHERE UID = $1', [uid], (error, results) => {
      if (error) {
          throw error;
      }
      res.status(200).send(`User deleted with id: ${uid}`)
  });
});

// Start the server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
