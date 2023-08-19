import React, { useEffect, useState } from 'react'
import { Table, Button, Offcanvas, Form, Alert } from 'react-bootstrap';
import { FaMoneyBillTrendUp } from 'react-icons/fa6'
import api from '../api';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [managers, setManagers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [player, setPlayer] = useState({});
    const [coaches, setCoaches] = useState([]);
    const [coach, setCoach] = useState({});
    const [team, setTeam] = useState({});
    const [show, setShow] = useState(false);
    const [showPlayers, setShowPlayers] = useState(false);
    const [showCoaches, setShowCoaches] = useState(false);
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [showEditPlayer, setShowEditPlayer] = useState(false);
    const [showAddCoach, setShowAddCoach] = useState(false);
    const [showEditCoach, setShowEditCoach] = useState(false);
    const [maxAvgCoach, setMaxAvgCoach] = useState([]);
    const [showCoach, setShowCoach] = useState(false);
    const [exp, setExp] = useState([])
    const [status, setStatus] = useState([])
    const [type, setType] = useState([])
    const [specialization, setSpecialization] = useState([])
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.token}`,
        },
    };

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

    const handleAddCoachClose = () => setShowAddCoach(false);

    const handleAddCoachShow = async (e) => {
        setShowAddCoach(true);
    }

    const handleEditCoachClose = () => setShowEditCoach(false);

    const handleEditPlayerShow = async (e) => {
        const pid = e.target.id.split('_')[1]
        setPlayer(players.filter(player => player.pid === pid)[0])
        setShowEditPlayer(true);
    }

    const handleEditCoachShow = async (e) => {
        const pid = e.target.id.split('_')[1]
        setCoach(coaches.filter(coach => coach.pid === pid)[0])
        setShowEditCoach(true);
    }

    const handleClose = () => setShow(false);

    const handleShow = async (e) => {
        const id = e.target.id.split('_')[1]
        setTeam(teams.filter(team => team.tid === id)[0])
        setShow(true);
    }

    const handleDeleteTeam = async (event) => {
        event.preventDefault();
        const tid = event.target.id.split('_')[1]
        try {
            const response = await api.delete(`/delete-team/${tid}`);
            console.log(response);
            fetchTeams();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleClosePlayers = () => setShowPlayers(false);

    const handleShowPlayers = async (e) => {
        const tid = e.target.id.split('_')[1];
        fetchPlayers(tid);
        setShowPlayers(true);
    }

    const handlePlayerDelete = async (event) => {
        event.preventDefault();
        const pid = event.target.id.split('_')[1];
        const tid = team.tid;
        try {
            const response = await api.delete(`/delete-player/${pid}`);
            console.log(response);
            fetchPlayers(tid);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleCoachDelete = async (event) => {
        event.preventDefault();
        const pid = event.target.id.split('_')[1];
        const tid = team.tid;
        try {
            const response = await api.delete(`/delete-coach/${pid}`);
            console.log(response);
            fetchCoaches(tid);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleCloseCoaches = () => setShowCoaches(false);

    const handleShowCoaches = async (e) => {
        const tid = e.target.id.split('_')[1];
        fetchCoaches(tid);
        setShowCoaches(true);
    }

    const fetchUsers = async () => {
        try {
            const users = await api.get('/users', {params: {
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
            const response = await api.get(`/players/${tid}`);
            setPlayers(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchPlayerContracts = async () => {
        try {
            const response = await api.get('/players-contract');
            setExp(response.data.yrs_of_exp);
            setStatus(response.data.status);
        } catch (error) {
            console.log(error.message);
        }
    }

    //TODO: fetch Coaches
    const fetchCoaches = async (tid) => {
        setTeam(teams.filter(team => team.tid === tid)[0]);
        try {
            const response = await api.get(`/coaches/${tid}`);
            setCoaches(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchCoachSalary = async () => {
        try {
            const response = await api.get('/coach-salary');
            setType(response.data.type);
            setSpecialization(response.data.specialization);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmitAddTeam = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/add-team', team);
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
            const response = await api.post(`add-player/${tid}`, player);
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
            const response = await api.put(`/update-player/${pid}`, player);
            console.log(response);
            fetchPlayers(player.tid);
            handleEditPlayerClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmitAddCoach = async (event) => {
        event.preventDefault();
        try {
            const tid = event.target.id.split('_')[1];
            setTeam(teams.filter(team => team.tid === tid)[0]);
            const response = await api.post(`/add-coach/${tid}`, coach);
            console.log(response);
            fetchCoaches(tid);
            handleAddCoachClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmitUpdateCoach = async (event) => {
        event.preventDefault();
        try {
            const pid = coach.pid;
            setCoach(coaches.filter(coach => coach.pid === pid)[0]);
            const response = await api.put(`/update-coach/${pid}`, coach);
            console.log(response);
            fetchCoaches(coach.tid);
            handleEditCoachClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmitUpdateTeam = async (event) => {
        event.preventDefault();
        const tid = team.tid;
        try {
            const response = await api.put(`/update-team/${tid}`, team);
            console.log(response);
            fetchTeams();
            handleClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams', config);
            setTeams(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchMaxAvgCoachType = async () => {
        try {
            const response = await api.get('/max-avg-coach-type');
            setMaxAvgCoach(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchTeams();
        fetchUsers();
        fetchPlayerContracts();
        fetchCoachSalary();
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
                                    <Button id={`deleteteam_${team.tid}`} variant='danger' size="sm"onClick={handleDeleteTeam}>Delete</Button>{' '}
                                    <Button id={`players_${team.tid}`} variant='primary' size="sm" onClick={handleShowPlayers}>Players</Button>{' '}
                                    <Button id={`coaches_${team.tid}`} variant='primary' size="sm" onClick={handleShowCoaches}>Coaches</Button>
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
                                <th>Status</th>
                                <th>Years of Experience</th>
                                <th>Position</th>
                                <th>Contract</th>
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
                                        <td>{player.status}</td>
                                        <td>{player.yrs_of_exp}</td>
                                        <td>{player.position}</td>
                                        <td>{player.contract}</td>
                                        <td>
                                            <Button id={`editplayer_${player.pid}`} variant='warning' size="sm" onClick={handleEditPlayerShow}>Edit</Button>{' '}
                                            <Button id={`deleteplayer_${player.pid}`} variant='danger' size="sm"onClick={handlePlayerDelete}>Delete</Button>{' '}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Offcanvas.Body>
            </Offcanvas>

            
            <Offcanvas show={showCoaches} placement='bottom' onHide={handleCloseCoaches} backdrop="static">
                <Offcanvas.Header className='bg-primary' closeButton>
                    <Offcanvas.Title className='text-light'>View Coaches</Offcanvas.Title>
                    <div className='text-light'>{team.name}</div>
                    <Button variant='outline-light' onClick={handleAddCoachShow}>+ Add Coach</Button>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Type</th>
                                <th>Specialization</th>
                                <th>Salary</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coaches.map((coach) => {
                                return (
                                    <tr key={coach.pid}>
                                        <td>{coach.firstname}</td>
                                        <td>{coach.lastname}</td>
                                        <td>{coach.type}</td>
                                        <td>{coach.specialization}</td>
                                        <td>{coach.salary}</td>
                                        <td>
                                            <Button id={`editcoach_${coach.pid}`} variant='warning' size="sm" onClick={handleEditCoachShow}>Edit</Button>{' '}
                                            <Button id={`deletecoach_${coach.pid}`} variant='danger' size="sm" onClick={handleCoachDelete}>Delete</Button>{' '}
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

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Status</Form.Label>
                            <Form.Select onChange={(e) => setPlayer({...player, status: e.target.value})}>
                                <option>Select Status</option>
                                {status && status.map(ctr => {
                                    return <option key={ctr.status} value={ctr.status}>{ctr.status}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Years of Experience</Form.Label>
                            <Form.Control type="text" placeholder="Enter Years of Experience" onChange={(e) => setPlayer({...player, yrs_of_exp: e.target.value})} />               
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Position</Form.Label>
                            <Form.Control type="text" placeholder="Enter Position" onChange={(e) => setPlayer({...player, position: e.target.value})} />
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
                            <Form.Label>Status</Form.Label>
                            <Form.Select defaultValue={player.status} onChange={(e) => setPlayer({...player, status: e.target.value})}>
                                <option>Select Status</option>
                                {status && status.map(ctr => {
                                    return <option key={ctr.status} value={ctr.status}>{ctr.status}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Years of Experience</Form.Label>
                        <Form.Control type="text" defaultValue={player.yrs_of_exp}placeholder="Enter Years of Experience" onChange={(e) => setPlayer({...player, yrs_of_exp: e.target.value})} />    
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Position</Form.Label>
                            <Form.Control type="text" defaultValue={player.position} placeholder="Enter Position" onChange={(e) => setPlayer({...player, position: e.target.value})} />
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

            <Offcanvas show={showAddCoach} placement='end' onHide={handleAddCoachClose}>
                <Offcanvas.Header className='bg-success' closeButton>
                    <Offcanvas.Title className='text-light'>Add Coach</Offcanvas.Title>
                    <div className='text-light'>{team.name}</div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form id={`addcoach_${team.tid}`} onSubmit={handleSubmitAddCoach}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter First Name" onChange={(e) => setCoach({...coach, firstname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Last Name" onChange={(e) => setCoach({...coach, lastname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Type</Form.Label>
                            <Form.Select onChange={(e) => setCoach({...coach, type: e.target.value})}>
                                <option>Select Type</option>
                                {type && type.map(ctr => {
                                    return <option key={ctr.type} value={ctr.type}>{ctr.type}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Specialization</Form.Label>
                            <Form.Select onChange={(e) => setCoach({...coach, specialization: e.target.value})}>
                                <option>Select Specialization</option>
                                {specialization && specialization.map(ctr => {
                                    return <option key={ctr.specialization} value={ctr.specialization}>{ctr.specialization}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={showEditCoach} placement='end' onHide={handleEditCoachClose}>
                <Offcanvas.Header className='bg-success' closeButton>
                    <Offcanvas.Title className='text-light'>Edit Coach</Offcanvas.Title>
                    <div className='text-light'>{coach.firstname} {coach.lastname}</div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmitUpdateCoach}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" defaultValue={coach.firstname} placeholder="Enter First Name" onChange={(e) => setCoach({...coach, firstname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" defaultValue={coach.lastname} placeholder="Enter Last Name" onChange={(e) => setCoach({...coach, lastname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Type</Form.Label>
                            <Form.Select defaultValue={coach.type} onChange={(e) => setCoach({...coach, type: e.target.value})}>
                                <option>Select Type</option>
                                {type && type.map(ctr => {
                                    return <option key={ctr.type} value={ctr.type}>{ctr.type}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Specialization</Form.Label>
                            <Form.Select defaultValue={coach.specialization} onChange={(e) => setCoach({...coach, specialization: e.target.value})}>
                                <option>Select Specialization</option>
                                {specialization && specialization.map(ctr => {
                                    return <option key={ctr.specialization} value={ctr.specialization}>{ctr.specialization}</option>
                                })}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Team</Form.Label>
                            <Form.Select defaultValue={coach.tid} onChange={(e) => setCoach({...coach, tid: e.target.value})}>
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
