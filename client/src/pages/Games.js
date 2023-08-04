import React, { useEffect, useState } from 'react'
import { Table, Button, Form, Offcanvas, Modal, Row, Col, Alert } from 'react-bootstrap';
import { FaGreaterThan, FaFilter, FaRankingStar, FaCalculator } from 'react-icons/fa6'
import axios from 'axios';

const Games = () => {
    const [games, setGames] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [venues, setVenues] = useState([]);
    const [teams, setTeams] = useState([]);
    const [game, setGame] = useState({});
    const [show, setShow] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [showAddGame, setShowAddGame] = useState(false);
    const [showAttendees, setShowAttendees] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState([]);
    const [avg, setAvg] = useState(0);
    const [lower, setLower] = useState(0);
    const [upper, setUpper] = useState(0);
    const [filteredRev, setFilteredRev] = useState([]);
    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [after, setAfter] = useState('');
    const [before, setBefore] = useState('');
    const [biggestFan, setBiggestFan] = useState({});
    const [showBiggestFan, setShowBiggestFan] = useState(false);
    const [cols, setCols] = useState({
        date: true,
        sport: true,
        home: true,
        away: true,
        starts: true,
        ends: true,
        venue: true,
        city: true,
        capacity: true,
        admin: true
    });

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleCloseRevenueModal = () => setShowRevenueModal(false);

    const handleShowRevenueModal = async () => {
        fetchStats();
        fetchAvg();
        setShowRevenueModal(true);
    }

    const handleRevenueFiler = async (e) => {
        e.preventDefault();
        fetchFilteredRevenue();
    }

    const handleApplyFilter = async () => {
        try {
            fetchGames();
            handleCloseModal();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleDateFilter = async () => {
        try {
            fetchFilteredGames();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleBiggestFan = async () => {
        try {
            fetchBiggestFan()
            setShowBiggestFan(true);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchBiggestFan = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/biggest-fan`);
            console.log(response.data);
            setBiggestFan(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchFilteredGames = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/filtered-games/${after}/${before}`);
            setGames(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleShow = async (e) => {
        const gid = e.target.id.split('_')[1];
        setGame(games.filter(game => game.gid === gid)[0])
        setShow(true);
    }

    const handleDeleteGame = async (event) => {
        event.preventDefault();
        const gid = event.target.id.split('_')[1]
        try {
            const response = await axios.delete(`http://localhost:5000/delete-game/${gid}`);
            console.log(response);
            fetchGames();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleShowAttendees = async (e) => {
        const gid = e.target.id.split('_')[1];
        setGame(games.filter(game => game.gid === gid)[0])
        fetchAttendees(gid)
        setShowAttendees(true);
    }

    const handleAttendeesClose = () => setShowAttendees(false);
    
    const handleAddGameShow = async (e) => {
        setShowAddGame(true);
    }

    const handleClose = () => setShow(false);

    const handleAddGameClose = () => setShowAddGame(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put('http://localhost:5000/update-game', game);
            fetchGames();
            handleClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleAddGameSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put('http://localhost:5000/add-game', game);
            fetchGames();
            handleAddGameClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchGames = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/games`, {params: cols});
            setGames(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchVenues = async () => {
        try {
            const response = await axios.get('http://localhost:5000/venues');
            setVenues(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:5000/teams');
            setTeams(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchAttendees = async (gid) => {
        try {
            const response = await axios.get(`http://localhost:5000/attendee/${gid}`);
            console.log(response.data)
            setAttendees(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchAdmins = async () => {
        try {
            const users = await axios.get('http://localhost:5000/users', {params: {
                firstname: true,
                lastname: true,
                email: true,
                role: true}
            });
            const adminsList = users.data.filter(user => user.role === 'admin');
            setAdmins(adminsList);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/stats');
            setStats(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchAvg = async () => {
        try {
            const response = await axios.get('http://localhost:5000/avg-revenue');
            console.log(response)
            setAvg(response.data[0]['avg_price']);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchFilteredRevenue = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/filter-revenue/${upper}/${lower}`);
            setFilteredRev(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchGames();
        fetchVenues();
        fetchTeams();
        fetchAdmins();
    }, []);

    return (
        <>
            <Alert show={showBiggestFan} variant="success">
                <Alert.Heading>Result</Alert.Heading>
                <hr />
                <p>
                    The following attendees have attended all games that we have hosted:
                </p>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {biggestFan.length && biggestFan.map((fan) => {
                            return (
                                <tr key={fan.aid}>
                                    <td>{fan.firstname}</td>
                                    <td>{fan.lastname}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setShowBiggestFan(false)} variant="outline-success">
                        Close me
                    </Button>
                </div>
            </Alert>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                    After
                </Form.Label>
                <Col sm="3">
                    <Form.Control type='date' onChange={(e) => setAfter(e.target.value)} />
                </Col>
                <Form.Label column sm="2">
                    Before
                </Form.Label>
                <Col sm="3">
                    <Form.Control type='date' onChange={(e) => setBefore(e.target.value)} />
                </Col>
                <Col sm="2" onClick={handleDateFilter}>
                    <Button variant="primary">Apply filter</Button>
                </Col>
            </Form.Group>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        { games[0] && games[0].date && <th>Date</th> }
                        { games[0] && games[0].sport && <th>Sport</th> }
                        { games[0] && games[0].home && <th>Home</th> }
                        { games[0] && games[0].away && <th>Away</th> }
                        { games[0] && games[0].start_time && <th>Starts</th> }
                        { games[0] && games[0].end_time && <th>Ends</th> }
                        { games[0] && games[0].venue && <th>Venue</th> }
                        { games[0] && games[0].city && <th>City</th> }
                        { games[0] && games[0].capacity && <th>Capacity</th> }
                        { games[0] && games[0].admin_firstname && <th>Admin</th> }
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => {
                        return (
                            <tr key={game.gid}>
                                {game.date && <td>{(game.date).toString().split('T')[0]}</td>}
                                {game.sport && <td>{game.sport}</td>}
                                {game.home && <td>{game.home}</td>}
                                {game.away && <td>{game.away}</td>}
                                {game.start_time && <td>{game.start_time}</td>}
                                {game.end_time && <td>{game.end_time}</td>}
                                {game.venue && <td>{game.venue}</td>}
                                {game.city && <td>{game.city}</td>}
                                {game.capacity && <td>{game.capacity}</td>}
                                {game.admin_firstname && <td>{game.admin_firstname} {game.admin_lastname}</td>}
                                <td>
                                    <Button id={`editgame_${game.gid}`} variant='warning' size="sm" onClick={handleShow}>Edit</Button>{' '}
                                    <Button id={`deletegame_${game.gid}`} variant='danger' size="sm"onClick={handleDeleteGame}>Delete</Button>{' '}
                                    <Button id={`attendees_${game.gid}`} variant='primary' size="sm" onClick={handleShowAttendees}>Attendees</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            <Button variant='outline-success' onClick={handleAddGameShow}>+ Add New Game</Button>
            <Button variant="outline-primary" className="m-3" onClick={handleShowModal}>
                <span className='d-flex justify-content-center align-items-center'><FaFilter className='mx-2'/>Filter Columns</span>
            </Button>
            <Button variant="outline-info" onClick={handleBiggestFan}>
                 <span className='d-flex justify-content-center align-items-center'><FaRankingStar className='mx-2'/>Biggest Fans</span>
            </Button>
            <Button variant="outline-danger" className='m-3' onClick={handleShowRevenueModal}>
                 <span className='d-flex justify-content-center align-items-center'><FaCalculator className='mx-2'/>Check Revenue</span>
            </Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Filter Columns
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Check checked={cols.date} type='checkbox' label='Date' onChange={(e) => setCols({...cols, date: e.target.checked})} />
                        </Col>
                        <Col>
                            <Form.Check checked={cols.sport} type='checkbox' label='Sport' onChange={(e) => setCols({...cols, sport: e.target.checked})} />
                        </Col>
                        <Col>
                            <Form.Check checked={cols.home} type='checkbox' label='Home' onChange={(e) => setCols({...cols, home: e.target.checked})} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Check checked={cols.away} type='checkbox' label='Away' onChange={(e) => setCols({...cols, away: e.target.checked})} />
                        </Col>
                        <Col>
                            <Form.Check checked={cols.starts} type='checkbox' label='Starts' onChange={(e) => setCols({...cols, starts: e.target.checked})} />
                        </Col>
                        <Col>
                            <Form.Check checked={cols.ends} type='checkbox' label='Ends' onChange={(e) => setCols({...cols, ends: e.target.checked})} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Check checked={cols.venue} type='checkbox' label='Venue' onChange={(e) => setCols({...cols, venue: e.target.checked})} />
                        </Col>
                        <Col>
                            <Form.Check checked={cols.city} type='checkbox' label='City' onChange={(e) => setCols({...cols, city: e.target.checked})} />
                        </Col>
                        <Col>
                            <Form.Check checked={cols.capacity} type='checkbox' label='Capacity' onChange={(e) => setCols({...cols, capacity: e.target.checked})} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Check checked={cols.admin} type='checkbox' label='Admin' onChange={(e) => setCols({...cols, admin: e.target.checked})} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleApplyFilter}>
                    Filter
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showRevenueModal} onHide={handleCloseRevenueModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Stats</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Home</th>
                                <th>Away</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((stat) => {
                                return (
                                    <tr key={stat.date}>
                                        <td>{stat.date}</td>
                                        <td>{stat.home}</td>
                                        <td>{stat.away}</td>
                                        <td>{stat.revenue}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col sm="4">
                            <Form.Label>Average revenue</Form.Label>
                        </Col>
                        <Col sm="8">
                            <Form.Control type="number" value={avg} disabled />
                        </Col>
                    </Form.Group>
                    <Form onSubmit={handleRevenueFiler}>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                            <Form.Label column sm="1"><FaGreaterThan /></Form.Label>
                            <Col sm="11">
                                <Form.Control type="number" placeholder="Lower Revenue Limit" onChange={(e) => setUpper(e.target.value)} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label column sm="1"><FaGreaterThan style = {{transform: 'rotate(180deg)' }} /></Form.Label>
                            <Col sm="11">
                                <Form.Control type="number" placeholder="Upper Revenue Limit" onChange={(e) => setLower(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Button variant="primary" type="submit" className='mb-3' >
                            Apply
                        </Button>
                    </Form>

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Home</th>
                                <th>Away</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRev.map((rev) => {
                                return (
                                    <tr key={rev.date}>
                                        <td>{rev.date}</td>
                                        <td>{rev.home}</td>
                                        <td>{rev.away}</td>
                                        <td>{rev.revenue}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            <Offcanvas show={show} placement='end' onHide={handleClose}>
                <Offcanvas.Header className='bg-warning' closeButton>
                    <Offcanvas.Title>Edit Game</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Date</Form.Label>
                            <Form.Control defaultValue={game.date} type="date" placeholder="Enter Date" onChange={(e) => setGame({...game, date: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Sport</Form.Label>
                            <Form.Control defaultValue={game.sport} type="text" placeholder="Enter Sport" onChange={(e) => setGame({...game, sport: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control defaultValue={game.start_time} type="time" placeholder="Enter Start Time" onChange={(e) => setGame({...game, start_time: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control defaultValue={game.end_time} type="time" placeholder="Enter End Time" onChange={(e) => setGame({...game, end_time: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Venue</Form.Label>
                            <Form.Select defaultValue={game.vid} onChange={(e) => setGame({...game, vid: e.target.value})}>
                                <option>Select Venue</option>
                                {venues.map(venue => {
                                    return <option key={venue.vid} value={venue.vid}>{venue.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Home Team</Form.Label>
                            <Form.Select defaultValue={game.home_tid} onChange={(e) => setGame({...game, home_tid: e.target.value})}>
                                <option>Select Home Team</option>
                                {teams.map(team => {
                                    return <option key={team.tid} value={team.tid}>{team.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Away Team</Form.Label>
                            <Form.Select defaultValue={game.away_tid} onChange={(e) => setGame({...game, away_tid: e.target.value})}>
                                <option>Select Away Team</option>
                                {teams.map(team => {
                                    return <option key={team.tid} value={team.tid}>{team.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Admin</Form.Label>
                            <Form.Select defaultValue={game.uid} onChange={(e) => setGame({...game, uid: e.target.value})}>
                                <option>Select Admin</option>
                                {admins.map(admin => {
                                    return <option key={admin.uid} value={admin.uid}>{admin.firstname} {admin.lastname}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={showAddGame} placement='end' onHide={handleAddGameClose}>
                <Offcanvas.Header className='bg-success' closeButton>
                    <Offcanvas.Title className='text-white'>Add New Game</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleAddGameSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" placeholder="Enter Date" onChange={(e) => setGame({...game, date: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Sport</Form.Label>
                            <Form.Control type="text" placeholder="Enter Sport" onChange={(e) => setGame({...game, sport: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control type="time" placeholder="Enter Start Time" onChange={(e) => setGame({...game, start_time: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control type="time" placeholder="Enter End Time" onChange={(e) => setGame({...game, end_time: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Venue</Form.Label>
                            <Form.Select onChange={(e) => setGame({...game, vid: e.target.value})}>
                                <option>Select Venue</option>
                                {venues.map(venue => {
                                    return <option key={venue.vid} value={venue.vid}>{venue.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Home Team</Form.Label>
                            <Form.Select onChange={(e) => setGame({...game, home_tid: e.target.value})}>
                                <option>Select Home Team</option>
                                {teams.map(team => {
                                    return <option key={team.tid} value={team.tid}>{team.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Away Team</Form.Label>
                            <Form.Select onChange={(e) => setGame({...game, away_tid: e.target.value})}>
                                <option>Select Away Team</option>
                                {teams.map(team => {
                                    return <option key={team.tid} value={team.tid}>{team.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Admin</Form.Label>
                            <Form.Select onChange={(e) => setGame({...game, uid: e.target.value})}>
                                <option>Select Admin</option>
                                {admins.map(admin => {
                                    return <option key={admin.uid} value={admin.uid}>{admin.firstname} {admin.lastname}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={showAttendees} placement='bottom' onHide={handleAttendeesClose}>
                <Offcanvas.Header className='bg-primary' closeButton>
                    <Offcanvas.Title className='text-light'>Attendees</Offcanvas.Title>
                    <div className='text-light'>{game.home} v/s {game.away}</div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Seat Number</th>
                                <th>Paid</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendees.map((atendee) => {
                                return (
                                    <tr key={atendee.aid}>
                                        <td>{atendee.firstname}</td>
                                        <td>{atendee.lastname}</td>
                                        <td>{atendee.email}</td>
                                        <td>{atendee.seat_num}</td>
                                        <td>{atendee.price}</td>
                                        <td>{atendee.status}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default Games