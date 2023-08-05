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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.post('/login', async (req, res) => {
    const { email, password} = req.body;
    console.log(email, password)
    const result = await pool.query("SELECT * FROM Users WHERE email = $1 AND password = $2", [email, password]);
    console.log(result)
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

app.get('/filtered-roles/:filterRole', (req, res) => {
  const filterRole = req.params['filterRole'];

  pool.query(`SELECT * FROM Users WHERE role=$1`, [filterRole], (err, result) => {
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
      const result = await pool.query(qry, [`%${firstname||''}%`, `%${lastname||''}%`, `%${email||''}%`, `%${role||''}%`])
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
      WHERE s.name LIKE $1 ${contribution && `AND (svc.contribution::numeric) >= ${contribution} `} AND v.name LIKE $2 AND status LIKE $3
    `;

    try {
      const result = await pool.query(qry, [`%${name}%`, `%${venue}%`, `%${status}%`])
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
      WHERE ${date && `date = '${date}' AND `} ${start_time && `start_time = '${start_time}' AND `} ${end_time && `end_time = '${end_time}' AND `} sport LIKE $1
    `;

    try {
      const result = await pool.query(qry, [`%${sport}%`])
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
      WHERE name LIKE $1 AND ${winrate && `winrate = '${winrate}' AND `} city LIKE $2
    `;

    try {
      const result = await pool.query(qry, [`%${name||''}%`, `%${city||''}%`])
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
    SELECT v.*, vpc.city, vpc.province
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

//TODO: Add PostalCode/DONE + Add City and Province
app.put('/update-venue', (req, res) => {
  const {name, postalcode, capacity, city, province, vid} = req.body;

  pool.query('UPDATE Venue SET name=$1, postalcode=$2, capacity=$3, city=$4, province=$5 WHERE vid=$6', [name, postalcode, capacity, city, province, vid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(result.rows);
      }
  });
});

//TODO: Add Postal Code/DONE + Add City and Province
app.post('/add-venue', (req, res) => {
  const vid = uuidv4();
  const {name, postalcode, capacity, city, province} = req.body;

  pool.query('INSERT INTO Venue VALUES ($1, $2, $3, $4, $5, $6)', [vid, name, postalcode, capacity, city, province], (err, result) => {
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

app.get('/biggest-fan', async (req, res) => {
  const query = `
  SELECT a.aid, a.firstname, a.lastname
  FROM Attendee a
  WHERE NOT EXISTS((
    SELECT g.gid
    FROM Game g
    ) EXCEPT (
      SELECT t.gid
      FROM Ticket t
      WHERE t.aid=a.aid
  ))`

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error retrieving biggest fan');
    } else {
      res.json(result.rows);
    }
  });
})

app.get('/filtered-games/:after/:before', async (req, res) => {
  const after = req.params['after'];
  const before = req.params['before'];

  const query = `
    SELECT CAST(g.date AS VARCHAR(20)), g.sport, t1.name AS home, t2.name AS away, g.start_time, g.end_time, v.name AS venue, vpc.city, v.capacity, u.firstname AS admin_firstname, u.lastname AS admin_lastname, g.gid, g.vid, g.home_tid, g.away_tid, g.uid
    FROM Game g 
    JOIN TeamManaged t1 ON g.home_tid = t1.tid 
    JOIN TeamManaged t2 ON g.away_tid = t2.tid 
    JOIN Venue v ON g.vid = v.vid 
    JOIN VenuePostalCode vpc ON v.postalcode = vpc.postalcode 
    JOIN Users u ON g.uid = u.uid
    WHERE g.date > $1 AND g.date < $2
  `;

  pool.query(query, [after, before], (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error retrieving games');
    } else {
      res.json(result.rows);
    }
  });
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
  const { gid, date, sport, start_time, end_time, vid, home_tid, away_tid, uid} = req.body;

  try {
    const updateGameResult = await pool.query('UPDATE Game SET sport=$1, date=$9, start_time=$2, end_time=$3, home_tid=$4, away_tid=$5, vid=$6, uid=$8 WHERE gid=$7', [sport, start_time, end_time, home_tid, away_tid, vid, gid, uid, date]);  
    res.json(updateGameResult.rows);
  } catch (err) {
    console.error('Error executing queries', err);
    res.status(500).send('Error updating database');
  }
});

app.put('/add-game', async (req, res) => {
  const gid = uuidv4(); 
  const { date, sport, start_time, end_time, vid, home_tid, away_tid, uid} = req.body;

  try {
    const addGameResult = await pool.query('INSERT INTO Game VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [gid, vid, home_tid, away_tid, uid, date, start_time, end_time, sport]);
    res.json(addGameResult.rows);
  } catch (err) {
    console.error('Error executing queries', err);
    res.status(500).send('Error inserting game into database');
  }
});

app.get('/players/:tid', (req, res) => {
  const tid = req.params['tid'];
  pool.query('SELECT sp.*, p.*, pc.contract FROM SportsPeople sp JOIN Players p ON sp.pid = p.pid JOIN PlayersContract pc ON p.yrs_of_exp = pc.yrs_of_exp AND p.status = pc.status WHERE tid = $1', [tid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving players');
      } else {
        res.json(result.rows);
      }
  });
});

//TODO: Get Coaches
app.get('/coaches/:tid', (req, res) => {
  const tid = req.params['tid'];
  pool.query('SELECT sp.*, c.type, c.specialization, cs.salary FROM SportsPeople sp JOIN Coach c ON sp.pid = c.pid JOIN CoachSalary cs ON c.type = cs.type AND c.specialization = cs.specialization WHERE tid = $1', [tid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving coaches');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/sponsors/:vid', async (req, res) => {
  const vid = req.params['vid'];

  pool.query('SELECT s.*, svc.status, v.vid, v.name as venue, sv.contribution FROM Sponsor s JOIN SponsorVenue sv ON s.sid = sv.sid JOIN Venue v ON v.vid = sv.vid JOIN SponsorVenueContribution svc on svc.contribution = sv.contribution WHERE v.vid = $1', [vid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving sponsors');
      } else {
        res.json(result.rows);
      }
  });
});

app.get('/players-contract', async (req, res) => {

  try {
    const yrs_of_exp = await pool.query('SELECT DISTINCT yrs_of_exp FROM PlayersContract');

    const status = await pool.query('SELECT DISTINCT status FROM PlayersContract');

    res.json({ yrs_of_exp: yrs_of_exp.rows, status: status.rows });
  } catch (err) {
    console.error('Error executing queries', err);
    res.status(500).send('Error inserting into database');
    res.status(500).send('Error inserting game into database');
  }
})

app.post('/add-player/:tid', async (req, res) => {
  const pid = uuidv4(); 
  const tid = req.params['tid'];
  const {firstname, lastname, jersey_num, position, status, yrs_of_exp} = req.body;

  try {
    const addSportsPersonResult = await pool.query('INSERT INTO SportsPeople VALUES ($1, $2, $3, $4)', [pid, tid, firstname, lastname]);

    const addPlayerResult = await pool.query('INSERT INTO Players VALUES ($1, $2, $3, $4, $5)', [pid, status, yrs_of_exp, jersey_num, position]);

    res.json({ sportsPeople: addSportsPersonResult.rows, players: addPlayerResult.rows });
  } catch (err) {
    console.error('Error executing queries', err);
    res.status(500).send('Error inserting into database');
    res.status(500).send('Error inserting game into database');
  }
});

app.put('/update-player/:pid', async (req, res) => {
  const pid = req.params['pid'];
  const {firstname, lastname, jersey_num, position, status, yrs_of_exp, tid} = req.body;

  try {
    const updateSportsPersonResult = await pool.query('UPDATE SportsPeople SET firstname=$1, lastname=$2, tid=$3 WHERE pid=$4', [firstname, lastname, tid, pid]);
    
    const updatePlayerResult = await pool.query('UPDATE Players SET status=$1, yrs_of_exp=$2, jersey_num=$3, position=$4 WHERE pid=$5', [status, yrs_of_exp, jersey_num, position, pid]);

    res.json({ sportsPeople: updateSportsPersonResult.rows, players: updatePlayerResult.rows });
  } catch (err) {
    console.error('Error executing queries', err);
    res.status(500).send('Error updating database');
    res.status(500).send('Error updating player');
  }
});

//TODO: Add Coach
app.post('/add-coach/:tid', (req, res) => {
  const pid = uuidv4(); 
  const tid = req.params['tid'];
  const {firstname, lastname, type, specialization, salary} = req.body;

  pool.query('INSERT INTO Coach VALUES ($1, $2, $3, $4, $5, $6)', [pid, tid, firstname, lastname, type, specialization, salary], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving players');
      } else {
        res.json(result.rows);
      }
  });
});

//TODO: Update Coach
app.put('/update-coach/:pid', (req, res) => {
  const pid = req.params['pid'];
  const {firstname, lastname, type, specialization, salary, tid} = req.body;

  pool.query('UPDATE Coach SET firstname = $1, lastname = $2, type = $3, specialization = $4, salary = $5, TID = $6 WHERE PID = $7', [firstname, lastname, type, specialization, salary, tid, pid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error retrieving coaches');
      } else {
        res.json(result.rows);
      }
  });
});

app.put('/update-team/:tid', (req, res) => {
  const tid = req.params['tid'];
  const {name, city, winrate, uid} = req.body;

  pool.query('UPDATE TeamManaged SET name = $1, city = $2, winrate = $3, UID = $4 WHERE TID = $5', [name, city, winrate, uid, tid], (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error updating team');
      } else {
        res.json(result.rows);
      }
  });
});

app.post('/add-user', (req, res) => {
  const uid = uuidv4(); 
  const { email, password, firstname, lastname, role } = req.body;

  pool.query("INSERT INTO Users VALUES ($1, $2, $3, $4, $5, $6)", [uid, firstname, lastname, email, password, role], (error, results) => {
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
    const { email, password, firstname, lastname, role } = req.body;

    pool.query('UPDATE Users SET email = $1, password = $2, firstname = $3, lastname = $4, role = $5 WHERE UID = $6', [email, password, firstname, lastname, role, uid], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`User modified with id: ${uid}`)
    });
});

app.delete('/delete-user/:uid', (req, res) => {
  const uid = req.params['uid'];

  pool.query('DELETE FROM Users WHERE uid = $1', [uid], (error, results) => {
      if (error) {
          throw error;
      }
      res.status(200).send(`User deleted with id: ${uid}`)
  });
});

//DELETE GAMES

app.delete('/delete-game/:gid', (req, res) => {
  const gid = req.params['gid'];

  pool.query('DELETE FROM game WHERE gid = $1', [gid], (error, results) => {
      if (error) {
          throw error;
      }
      res.status(200).send(`Game deleted with id: ${gid}`)
  });
});


app.delete('/delete-venue/:vid', async (req, res) => {
  const vid = req.params['vid'];

  pool.query('DELETE FROM Venue WHERE vid = $1', [vid], (error, results) => {
      if (error) {
          throw error;
      }
      res.status(200).send(`Venue deleted with id: ${vid}`)
  });
});

//DELETE PLAYERS
app.delete('/delete-player/:pid', async (req, res) => {
  const pid = req.params['pid'];

  pool.query('DELETE FROM sportspeople WHERE pid = $1', [pid], (error, results) => {
      if (error) {
          throw error;
      }
      res.status(200).send(`Player deleted with id: ${pid}`)
  });
});

//DELETE COACHES

//DELETE TEAM
app.delete('/delete-team/:tid', async (req, res) => {
  const tid = req.params['tid'];

  pool.query('DELETE FROM teammanaged WHERE tid = $1', [tid], (error, results) => {
      if (error) {
          throw error;
      }
      res.status(200).send(`Team deleted with id: ${tid}`)
  });
});

// Start the server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
