import React, { useState } from 'react'
import { Form, Row, Col, Button, Card, Table } from 'react-bootstrap';
import { FaGreaterThanEqual } from 'react-icons/fa6'
import axios from 'axios';

const Custom = () => {
    const [table, setTable] = useState('');
    const [result, setResult] = useState([]);
    const [query, setQuery] = useState({
        users: {
            firstname: '',
            lastname: '',
            email: '',
            role: ''
        },
        sponsor: {
            name: '',
            contribution: 0,
            venue: '',
            status: ''
        },
        game: {
            date: '',
            start_time: '',
            end_time: '',
            sport: ''
        },
        teammanaged: {
            name: '',
            winrate: '',
            city: ''
        }
    });
    const [cols, setCols] = useState({
        users: {
            firstname: true,
            lastname: true,
            email: true,
            role: true
        },
        sponsor: {
            name: true,
            contribution: true,
            venue: true,
            status: true
        },
        game: {
            date: true,
            start_time: true,
            end_time: true,
            sport: true
        },
        teammanaged: {
            name: true,
            winrate: true,
            city: true
        }
    });

    const handleChange = (e) => {
        console.log(e.target.value)
        setTable(e.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/custom', {params: {query, table, cols}});
            setResult(response.data)
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Table</Form.Label>
                <Form.Select onChange={handleChange}>
                    <option>Select a table</option>
                    <option value="users">Users</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="game">Game</option>
                    <option value="teammanaged">Team</option>
                </Form.Select>
            </Form.Group>
            {table === 'users' && (
            <>
                <Card className='p-2 my-3'>
                    <Row>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.users.firstname}
                                        label='First Name' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                users: {
                                                    ...cols.users, 
                                                    firstname: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.users.lastname}
                                        label='Last Name' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                users: {
                                                    ...cols.users, 
                                                    lastname: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                   </Row>
                   <Row>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.users.email}
                                        label='Email' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                users: {
                                                    ...cols.users, 
                                                    email: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.users.role}
                                        label='Role' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                users: {
                                                    ...cols.users, 
                                                    role: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                   </Row>
                </Card>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        users: {
                                            ...query.users, 
                                            firstname: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        users: {
                                            ...query.users, 
                                            lastname: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        users: {
                                            ...query.users, 
                                            email: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Role</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        users: {
                                            ...query.users, 
                                            role: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            { result[0] && result[0].firstname && <th>First Name</th> }
                            { result[0] && result[0].lastname && <th>Last Name</th> }
                            { result[0] && result[0].email && <th>Email</th> }
                            { result[0] && result[0].role && <th>Role</th> }
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((user) => {
                            return (
                                <tr key={user.email}>
                                    {user.firstname && <td>{user.firstname}</td>}
                                    {user.lastname && <td>{user.lastname}</td>}
                                    {user.email && <td>{user.email}</td>}
                                    {user.role &&  <td>{user.role}</td>}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </>
            )}
            {table === 'sponsor' && (
            <>
                <Card className='p-2 my-3'>
                    <Row>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.sponsor.name}
                                        label='Name' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                sponsor: {
                                                    ...cols.sponsor, 
                                                    name: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.sponsor.contribution}
                                        label='Contribution' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                sponsor: {
                                                    ...cols.sponsor, 
                                                    contribution: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                   </Row>
                   <Row>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.sponsor.venue}
                                        label='Venue' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                sponsor: {
                                                    ...cols.sponsor, 
                                                    venue: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.sponsor.status}
                                        label='Name' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                sponsor: {
                                                    ...cols.sponsor, 
                                                    status: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                   </Row>
                </Card>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        sponsor: {
                                            ...query.sponsor, 
                                            name: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Contribution <FaGreaterThanEqual/></Form.Label>
                            <Form.Control 
                                type="number"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        sponsor: {
                                            ...query.sponsor, 
                                            contribution: e.target.value??0 
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Venue</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        sponsor: {
                                            ...query.sponsor, 
                                            venue: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Status</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        sponsor: {
                                            ...query.sponsor, 
                                            status: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            { result[0] && result[0].name && <th>Sponsor</th> }
                            { result[0] && result[0].contribution && <th>Contribution</th> }
                            { result[0] && result[0].venue && <th>Venue</th> }
                            { result[0] && result[0].status && <th>Status</th> }
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((sponsor) => {
                            return (
                                <tr key={sponsor.name}>
                                    {sponsor.name && <td>{sponsor.name}</td>}
                                    {sponsor.contribution && <td>{sponsor.contribution}</td>}
                                    {sponsor.venue && <td>{sponsor.venue}</td>}
                                    {sponsor.status &&  <td>{sponsor.status}</td>}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </>
            )}
            {table === 'game' && (
            <>
                <Card className='p-2 my-3'>
                    <Row>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.game.date}
                                        label='Date' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                game: {
                                                    ...cols.game, 
                                                    date: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.game.start_time}
                                        label='Start Time' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                game: {
                                                    ...cols.game, 
                                                    start_time: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                   </Row>
                   <Row>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.game.end_time}
                                        label='End Time' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                game: {
                                                    ...cols.game, 
                                                    end_time: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.game.sport}
                                        label='Sport' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                game: {
                                                    ...cols.game, 
                                                    sport: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                   </Row>
                </Card>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Date</Form.Label>
                            <Form.Control 
                                type="date"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        game: {
                                            ...query.game, 
                                            date: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control 
                                type="time"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        game: {
                                            ...query.game, 
                                            start_time: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control 
                                type="time"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        game: {
                                            ...query.game, 
                                            end_time: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Sport</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        game: {
                                            ...query.game, 
                                            sport: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            { result[0] && result[0].date && <th>Date</th> }
                            { result[0] && result[0].start_time && <th>Start Time</th> }
                            { result[0] && result[0].end_time && <th>End Time</th> }
                            { result[0] && result[0].sport && <th>Sport</th> }
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((game) => {
                            return (
                                <tr key={game.date}>
                                    {game.date && <td>{game.date}</td>}
                                    {game.start_time && <td>{game.start_time}</td>}
                                    {game.end_time && <td>{game.end_time}</td>}
                                    {game.sport &&  <td>{game.sport}</td>}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </>
            )}
            {table === 'teammanaged' && (
            <>
                <Card className='p-2 my-3'>
                    <Row>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.teammanaged.name}
                                        label='Name' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                teammanaged: {
                                                    ...cols.teammanaged, 
                                                    name: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.teammanaged.winrate}
                                        label='Win Rate' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                teammanaged: {
                                                    ...cols.teammanaged, 
                                                    winrate: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                   </Row>
                   <Row>
                        <Col>
                            <Form.Check type='checkbox'
                                        checked={cols.teammanaged.city}
                                        label='City' 
                                        onChange={(e) => 
                                            setCols({
                                                ...cols, 
                                                teammanaged: {
                                                    ...cols.teammanaged, 
                                                    city: e.target.checked
                                                }
                                            })
                                        } 
                            />
                        </Col>
                        <Col></Col>
                   </Row>
                </Card>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        teammanaged: {
                                            ...query.teammanaged, 
                                            name: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Win Rate</Form.Label>
                            <Form.Control 
                                type="number"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        teammanaged: {
                                            ...query.teammanaged, 
                                            winrate: e.target.value??0 
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>City</Form.Label>
                            <Form.Control 
                                type="text"
                                onChange={(e) => 
                                    setQuery({
                                        ...query, 
                                        teammanaged: {
                                            ...query.teammanaged, 
                                            city: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            { result[0] && result[0].name && <th>Name</th> }
                            { result[0] && result[0].city && <th>City</th> }
                            { result[0] && result[0].winrate && <th>Win Rate</th> }
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((team) => {
                            return (
                                <tr key={team.name}>
                                    {team.name && <td>{team.name}</td>}
                                    {team.city && <td>{team.city}</td>}
                                    {team.winrate && <td>{team.winrate}</td>}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </>
            )}
            <Button variant="primary" type="submit" className='mb-3' >
                Return
            </Button>
        </Form>
    )
}

export default Custom