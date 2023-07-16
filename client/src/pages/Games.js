import React, { useEffect, useState } from 'react'
import { Table, Button, Form, Offcanvas } from 'react-bootstrap';
import axios from 'axios';

const Games = () => {
    const [games, setGames] = useState([]);
    const [venues, setVenues] = useState([]);
    const [teams, setTeams] = useState([]);
    const [game, setGame] = useState({});
    const [show, setShow] = useState(false);
    const [showAddGame, setShowAddGame] = useState(false);

    const handleShow = async (e) => {
        const date = e.target.id.split('_')[1];
        setGame(games.filter(game => game.date === date)[0])
        setShow(true);
    }

    const handleAddGameShow = async (e) => {
        setShowAddGame(true);
    }

    const handleClose = () => setShow(false);

    const handleAddGameClose = () => setShowAddGame(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put('http://localhost:5000/update-game', game);
            console.log(response);
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
            console.log(response);
            fetchGames();
            handleAddGameClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchGames = async () => {
        try {
            const response = await axios.get('http://localhost:5000/games');
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

    useEffect(() => {
        fetchGames();
        fetchVenues();
        fetchTeams();
    }, []);

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Sport</th>
                        <th>Home</th>
                        <th>Away</th>
                        <th>Starts</th>
                        <th>Ends</th>
                        <th>Venue</th>
                        <th>City</th>
                        <th>Capacity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => {
                        return (
                            <tr key={(game.date).toString().split('T')[0]}>
                                <td>{game.date}</td>
                                <td>{game.sport}</td>
                                <td>{game.home}</td>
                                <td>{game.away}</td>
                                <td>{game.start_time}</td>
                                <td>{game.end_time}</td>
                                <td>{game.venue}</td>
                                <td>{game.city}</td>
                                <td>{game.capacity}</td>
                                <td>
                                    <Button id={`editgame_${game.date}`} variant='warning' size="sm" onClick={handleShow}>Edit</Button>{' '}
                                    <Button id={`deletegame_${game.date}`} variant='danger' size="sm">Delete</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            <Button variant='outline-success' onClick={handleAddGameShow}>+ Add New Game</Button>

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

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default Games