import React, { useEffect, useState } from 'react'
import { Table, Button, Offcanvas, Form, Alert } from 'react-bootstrap';
import { FaMoneyBillTrendUp } from 'react-icons/fa6'
import axios from 'axios';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [managers, setManagers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [player, setPlayer] = useState({});
    const [team, setTeam] = useState({});
    const [show, setShow] = useState(false);
    const [showPlayers, setShowPlayers] = useState(false);
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [showEditPlayer, setShowEditPlayer] = useState(false);
    const [maxAvgCoach, setMaxAvgCoach] = useState([]);
    const [showCoach, setShowCoach] = useState(false);

    const handleMaxAvgCoachType = async (e) => {
        fetchMaxAvgCoachType();
        setShowCoach(true);
    }

    const handleAddTeamClose = () => setShowAddTeam(false);

    const handleAddTeamShow = async (e) => {
        setShowAddTeam(true);
    } 

    const handleAddPlayerClose = () => setShowAddPlayer(false);

    const handleAddPlayerShow = async (e) => {
        setShowAddPlayer(true);
    }

    const handleEditPlayerClose = () => setShowEditPlayer(false);

    const handleEditPlayerShow = async (e) => {
        const pid = e.target.id.split('_')[1]
        console.log(pid)
        setPlayer(players.filter(player => player.pid === pid)[0])
        setShowEditPlayer(true);
    }

    const handleClose = () => setShow(false);

    const handleShow = async (e) => {
        const id = e.target.id.split('_')[1]
        setTeam(teams.filter(team => team.tid === id)[0])
        setShow(true);
    }

    const handleClosePlayers = () => setShowPlayers(false);

    const handleShowPlayers = async (e) => {
        const tid = e.target.id.split('_')[1];
        fetchPlayers(tid);
        setShowPlayers(true);
    }

    const fetchUsers = async () => {
        try {
            const users = await axios.get('http://localhost:5000/users', {params: {
                firstname: true,
                lastname: true,
                email: true,
                role: true}
            });
            const managersList = users.data.filter(user => user.role === 'manager');
            setManagers(managersList);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchPlayers = async (tid) => {
        setTeam(teams.filter(team => team.tid === tid)[0]);
        try {
            const response = await axios.get(`http://localhost:5000/players/${tid}`);
            console.log(response.data)
            setPlayers(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmitAddTeam = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/add-team', team);
            console.log(response);
            fetchTeams();
            handleAddTeamClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmitAddPlayer = async (event) => {
        event.preventDefault();
        try {
            const tid = event.target.id.split('_')[1];
            setTeam(teams.filter(team => team.tid === tid)[0]);
            const response = await axios.post(`http://localhost:5000/add-player/${tid}`, player);
            console.log(response);
            fetchPlayers(tid);
            handleAddPlayerClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmitUpdatePlayer = async (event) => {
        event.preventDefault();
        try {
            const pid = player.pid;
            setPlayer(players.filter(player => player.pid === pid)[0]);
            const response = await axios.put(`http://localhost:5000/update-player/${pid}`, player);
            console.log(response);
            fetchPlayers(player.tid);
            handleEditPlayerClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmitUpdateTeam = async (event) => {
        event.preventDefault();
        const tid = team.tid;
        try {
            const response = await axios.put(`http://localhost:5000/update-team/${tid}`, team);
            console.log(response);
            fetchTeams();
            handleClose();
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

    const fetchMaxAvgCoachType = async () => {
        try {
            const response = await axios.get('http://localhost:5000/max-avg-coach-type');
            setMaxAvgCoach(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchTeams();
        fetchUsers();
    }, [])

    return (
        <>
            <Alert show={showCoach} variant="success">
                <Alert.Heading>Result</Alert.Heading>
                <hr />
                <p>
                    The following coach types have a higher average salary than the average of all coach salaries:
                </p>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Coach Type</th>
                            <th>Average Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maxAvgCoach.map((coach) => {
                            return (
                                <tr key={coach.type}>
                                    <td>{coach.type}</td>
                                    <td>${coach.avg_salary}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setShowCoach(false)} variant="outline-success">
                        Close me
                    </Button>
                </div>
            </Alert>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Team Name</th>
                        <th>City</th>
                        <th>Win Rate</th>
                        <th>Manager</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team) => {
                        return (
                            <tr key={team.tid}>
                                <td>{team.name}</td>
                                <td>{team.city}</td>
                                <td>{team.winrate}</td>
                                <td>{team.firstname} {team.lastname}</td>
                                <td>
                                    <Button id={`editteam_${team.tid}`} variant='warning' size="sm" onClick={handleShow}>Edit</Button>{' '}
                                    <Button id={`deleteteam_${team.tid}`} variant='danger' size="sm">Delete</Button>{' '}
                                    <Button id={`players_${team.tid}`} variant='primary' size="sm" onClick={handleShowPlayers}>Players</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            <Button variant='outline-success' className='m-3' onClick={handleAddTeamShow}>+ Add New Team</Button>
            <Button variant='outline-primary' onClick={handleMaxAvgCoachType}><FaMoneyBillTrendUp className='mx-2'/>Coach Insights</Button>
            
            <Offcanvas show={show} placement='end' onHide={handleClose} backdrop="static">
                <Offcanvas.Header className='bg-warning' closeButton>
                    <Offcanvas.Title>Edit Team</Offcanvas.Title>
                    {team.name}
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmitUpdateTeam}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Team Name</Form.Label>
                            <Form.Control defaultValue={team.name} type="text" placeholder="Enter Team Name"  />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>City</Form.Label>
                            <Form.Control defaultValue={team.city} type="text" placeholder="Enter City" onChange={(e) => setTeam({...team, city: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Win Rate</Form.Label>
                            <Form.Control defaultValue={team.winrate} type="text" placeholder="Enter Win Rate" onChange={(e) => setTeam({...team, winrate: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Manager</Form.Label>
                            <Form.Select defaultValue={team.uid} onChange={(e) => setTeam({...team, uid: e.target.value})}>
                                <option>Select Manager</option>
                                {managers.map(manager => {
                                    return <option key={manager.uid} value={manager.uid}>{manager.firstname} {manager.lastname}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={showPlayers} placement='bottom' onHide={handleClosePlayers} backdrop="static">
                <Offcanvas.Header className='bg-primary' closeButton>
                    <Offcanvas.Title className='text-light'>View Players</Offcanvas.Title>
                    <div className='text-light'>{team.name}</div>
                    <Button variant='outline-light' onClick={handleAddPlayerShow}>+ Add Player</Button>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Jersey Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player) => {
                                return (
                                    <tr key={player.pid}>
                                        <td>{player.firstname}</td>
                                        <td>{player.lastname}</td>
                                        <td>{player.jersey_num}</td>
                                        <td>
                                            <Button id={`editplayer_${player.pid}`} variant='warning' size="sm" onClick={handleEditPlayerShow}>Edit</Button>{' '}
                                            <Button id={`deleteplayer_${player.pid}`} variant='danger' size="sm">Delete</Button>{' '}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={showAddTeam} placement='end' onHide={handleAddTeamClose}>
                <Offcanvas.Header className='bg-success' closeButton>
                    <Offcanvas.Title className='text-light'>Add Team</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmitAddTeam}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Team Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Team Name" onChange={(e) => setTeam({...team, name: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="Enter City" onChange={(e) => setTeam({...team, city: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Win Rate</Form.Label>
                            <Form.Control type="text" placeholder="Enter Last Name" onChange={(e) => setTeam({...team, winrate: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Manager</Form.Label>
                            <Form.Select onChange={(e) => setTeam({...team, uid: e.target.value})}>
                                <option>Select Manager</option>
                                {managers.map(manager => {
                                    return <option key={manager.uid} value={manager.uid}>{manager.firstname} {manager.lastname}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={showAddPlayer} placement='end' onHide={handleAddPlayerClose}>
                <Offcanvas.Header className='bg-success' closeButton>
                    <Offcanvas.Title className='text-light'>Add Player</Offcanvas.Title>
                    <div className='text-light'>{team.name}</div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form id={`addplayer_${team.tid}`} onSubmit={handleSubmitAddPlayer}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter First Name" onChange={(e) => setPlayer({...player, firstname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Last Name" onChange={(e) => setPlayer({...player, lastname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Jersey Number</Form.Label>
                            <Form.Control type="text" placeholder="Enter Jersey Number" onChange={(e) => setPlayer({...player, jersey_num: e.target.value})} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={showEditPlayer} placement='end' onHide={handleEditPlayerClose}>
                <Offcanvas.Header className='bg-success' closeButton>
                    <Offcanvas.Title className='text-light'>Edit Player</Offcanvas.Title>
                    <div className='text-light'>{player.firstname} {player.lastname}</div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmitUpdatePlayer}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" defaultValue={player.firstname} placeholder="Enter First Name" onChange={(e) => setPlayer({...player, firstname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" defaultValue={player.lastname} placeholder="Enter Last Name" onChange={(e) => setPlayer({...player, lastname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Jersey Number</Form.Label>
                            <Form.Control type="text" defaultValue={player.jersey_num} placeholder="Enter Jersey Number" onChange={(e) => setPlayer({...player, jersey_num: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Team</Form.Label>
                            <Form.Select defaultValue={player.tid} onChange={(e) => setPlayer({...player, tid: e.target.value})}>
                                <option>Select Team</option>
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

export default Teams
