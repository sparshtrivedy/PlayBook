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
    const { email, password} = req.body;

    const result = await pool.query("SELECT * FROM Users WHERE email = $1 AND password = $2", [email, password]);
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
  const { firstname, lastname, email, role } = req.query;

  const selectedColumns = ['uid', 'password'];
  if (firstname === 'true') selectedColumns.push('firstname');
  if (lastname === 'true') selectedColumns.push('lastname');
  if (email === 'true') selectedColumns.push('email');
  if (role === 'true') selectedColumns.push('role');

  const selectedColumnsString = selectedColumns.join(', ');

  pool.query(`SELECT ${selectedColumnsString} FROM Users`, (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/custom', async (req, res) => {
  const {query, table, cols} = req.query;
  const selectedColumns = [];

  if (table === 'users') {
    const {firstname, lastname, email, role} = query['users'];

    if (cols['users']['firstname'] === 'true') selectedColumns.push('firstname');
    if (cols['users']['lastname'] === 'true') selectedColumns.push('lastname');
    if (cols['users']['email'] === 'true') selectedColumns.push('email');
    if (cols['users']['role'] === 'true') selectedColumns.push('role');

    const selectedColumnsString = selectedColumns.join(', ');

    const qry = `
      SELECT ${selectedColumnsString}
      FROM Users
      WHERE firstname LIKE $1 AND lastname LIKE $2 AND email LIKE $3 AND role LIKE $4
    `;

    try {
      const result = await pool.query(qry, [`%${firstname}%`, `%${lastname}%`, `%${email}%`, `%${role}%`])
      res.json(result.rows)
    } catch (error) {
      console.error('Error executing queries', error);
      res.status(500).send('Error retrieving from database');
    }
  } else if (table === 'sponsor') {
    const {name, contribution, venue, status} = query['sponsor'];

    if (cols['sponsor']['name'] === 'true') selectedColumns.push('s.name');
    if (cols['sponsor']['contribution'] === 'true') selectedColumns.push('svc.contribution');
    if (cols['sponsor']['venue'] === 'true') selectedColumns.push('v.name as venue');
    if (cols['sponsor']['status'] === 'true') selectedColumns.push('status');

    const selectedColumnsString = selectedColumns.join(', ');

    const qry = `
      SELECT ${selectedColumnsString}
      FROM SponsorVenue sv
      JOIN Sponsor s on s.sid = sv.sid
      JOIN Venue v on v.vid = sv.vid
      JOIN SponsorVenueContribution svc on (sv.contribution::numeric) = (svc.contribution::numeric)
      WHERE s.name LIKE $1 AND (svc.contribution::numeric) >= $2 AND v.name LIKE $3 AND status LIKE $4
    `;

    try {
      const result = await pool.query(qry, [`%${name}%`, contribution, `%${venue}%`, `%${status}%`])
      res.json(result.rows)
    } catch (error) {
      console.error('Error executing queries', error);
      res.status(500).send('Error retrieving from database');
    }
  } else if (table === 'game') {
    const {date, start_time, end_time, sport} = query['game'];

    if (cols['game']['date'] === 'true') selectedColumns.push('CAST(date AS VARCHAR(20))');
    if (cols['game']['start_time'] === 'true') selectedColumns.push('start_time');
    if (cols['game']['end_time'] === 'true') selectedColumns.push('end_time');
    if (cols['game']['sport'] === 'true') selectedColumns.push('sport');

    const selectedColumnsString = selectedColumns.join(', ');

    const qry = `
      SELECT ${selectedColumnsString}
      FROM Game
      WHERE date=$1 AND start_time=$2 AND end_time=$3 AND sport LIKE $4
    `;

    try {
      const result = await pool.query(qry, [date, start_time, end_time, `%${sport}%`])
      res.json(result.rows)
    } catch (error) {
      console.error('Error executing queries', error);
      res.status(500).send('Error retrieving from database');
    }
  } else if (table === 'teammanaged') {
    const {name, winrate, city} = query['teammanaged'];

    if (cols['teammanaged']['name'] === 'true') selectedColumns.push('name');
    if (cols['teammanaged']['winrate'] === 'true') selectedColumns.push('winrate');
    if (cols['teammanaged']['city'] === 'true') selectedColumns.push('city');

    const selectedColumnsString = selectedColumns.join(', ');

    const qry = `
      SELECT ${selectedColumnsString}
      FROM TeamManaged
      WHERE name LIKE $1 AND winrate=$2 AND city LIKE $3
    `;

    try {
      const result = await pool.query(qry, [`%${name}%`, winrate, `%${city}%`])
      res.json(result.rows)
    } catch (error) {
      console.error('Error executing queries', error);
      res.status(500).send('Error retrieving from database');
    }
  }
});

app.get('/teams', (req, res) => {
  const query = `
    SELECT TeamManaged.*, Users.email, Users.firstname, Users.lastname 
    FROM TeamManaged 
    JOIN Users ON TeamManaged.uid=Users.uid
  `;
  pool.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving teams');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/max-avg-coach-type', (req, res) => {
  const query = `
    SELECT c.type, AVG(salary::numeric) AS avg_salary
    FROM Coach c
    JOIN CoachSalary ON c.type = CoachSalary.type AND c.specialization = CoachSalary.specialization
    GROUP BY c.type
    HAVING AVG(salary::numeric) > (
        SELECT AVG(salary::numeric)
        FROM CoachSalary
    )
  `;

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error retrieving coach');
    } else {
      res.json(result.rows);
    }
  });
})

app.get('/stats', (req, res) => {
  const query = `
    SELECT CAST(g.date AS VARCHAR(20)), t1.name as home, t2.name as away, SUM(price) as revenue
    FROM Game g
    JOIN Ticket t ON g.gid = t.gid
    JOIN Attendee a ON a.aid = t.aid
    JOIN TeamManaged t1 ON t1.tid = g.home_tid
    JOIN TeamManaged t2 ON t2.tid = g.away_tid
    GROUP BY g.gid, t1.name, t2.name
  `;

  pool.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving stats');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/avg-revenue', (req, res) => {
  const query = `
    SELECT AVG(revenue::numeric) AS avg_price
    FROM (
      SELECT g.gid, SUM(price) as revenue
      FROM Game g
      JOIN Ticket t ON g.gid = t.gid
      GROUP BY g.gid
    ) AS customer_counts;
  `;

  pool.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving stats');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/filter-revenue/:greater/:lower', (req, res) => {
  const greater = req.params['greater'];
  const lower = req.params['lower'];

  const query = `
    SELECT CAST(g.date AS VARCHAR(20)), t1.name as home, t2.name as away, SUM(price) as revenue
    FROM Game g
    JOIN Ticket t ON g.gid = t.gid
    JOIN Attendee a ON a.aid = t.aid
    JOIN TeamManaged t1 ON t1.tid = g.home_tid
    JOIN TeamManaged t2 ON t2.tid = g.away_tid
    GROUP BY g.gid, t1.name, t2.name
    HAVING SUM(price)>'$${greater}' AND SUM(price)<'$${lower}'
  `;

  pool.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/venues', (req, res) => {
  const query = `
    SELECT v.*, vpc.City 
    FROM Venue v 
    JOIN VenuePostalCode vpc ON v.postalcode = vpc.postalcode
  `
  pool.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.put('/update-venue', (req, res) => {
  const {name, city, capacity, vid} = req.body;

  pool.query('UPDATE Venue SET name=$1, city=$2, capacity=$3 WHERE vid=$4', [name, city, capacity, vid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.post('/add-venue', (req, res) => {
  const vid = uuidv4();
  const {name, city, capacity} = req.body;

  pool.query('INSERT INTO Venue VALUES ($1, $2, $3, $4)', [vid, name, city, capacity], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/games', async (req, res) => {
  const {
    date, sport, home, away, starts, ends, venue, city, capacity, admin
  } = req.query;

  const selectedColumns = [];
  if (date === 'true') selectedColumns.push('CAST(g.date AS VARCHAR(20))');
  if (sport === 'true') selectedColumns.push('g.sport');
  if (home === 'true') selectedColumns.push('t1.name AS home');
  if (away === 'true') selectedColumns.push('t2.name AS away');
  if (starts === 'true') selectedColumns.push('g.start_time');
  if (ends === 'true') selectedColumns.push('g.end_time');
  if (venue === 'true') selectedColumns.push('v.name AS venue');
  if (city === 'true') selectedColumns.push('vpc.city');
  if (capacity === 'true') selectedColumns.push('v.capacity');
  if (admin === 'true') {
    selectedColumns.push('u.firstname AS admin_firstname');
    selectedColumns.push('u.lastname AS admin_lastname');
  }

  const selectedColumnsString = selectedColumns.join(', ');

  const query = `
    SELECT ${selectedColumnsString}, g.gid, g.vid, g.home_tid, g.away_tid, g.uid
    FROM Game g 
    JOIN TeamManaged t1 ON g.home_tid = t1.tid 
    JOIN TeamManaged t2 ON g.away_tid = t2.tid 
    JOIN Venue v ON g.vid = v.vid 
    JOIN VenuePostalCode vpc ON v.postalcode = vpc.postalcode 
    JOIN Users u ON g.uid = u.uid
  `;

  try {
    const result = await pool.query(query)
    res.json(result.rows)
  } catch (error) {
    console.error('Error executing queries', error);
    res.status(500).send('Error retrieving from database');
  }
});

app.get('/attendee/:gid', (req, res) => {
  const gid = req.params['gid'];

  const query = `
    SELECT a.*, t.* 
    FROM Game g
    JOIN Ticket t ON g.gid = t.gid
    JOIN Attendee a ON a.aid = t.aid
    WHERE g.gid = $1
  `
  pool.query(query, [gid], (err, result) => {
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

  pool.query('SELECT sp.*, p.jersey_num FROM SportsPeople sp LEFT JOIN Players p ON sp.pid = p.pid WHERE tid = $1', [tid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving players');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/sponsors/:vid', async (req, res) => {
  const vid = req.params['vid'];

  pool.query('SELECT s.*, v.vid, v.name as venue, s1.contribution FROM Sponsor s JOIN Sponsors s1 ON s.sid = s1.sid JOIN Venue v ON v.vid = s1.vid WHERE v.vid = $1', [vid], (err, result) => {
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
  const { uid, city, name, winrate } = req.body;
  
  pool.query("INSERT INTO Team VALUES ($1, $2, $3, $4, $5)", [tid, uid, city, name, winrate], (error, results) => {
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
