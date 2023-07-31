import React, { useState } from 'react'
import { Form, Row, Col, Button, Card, Table } from 'react-bootstrap';
import axios from 'axios';

const Custom = () => {
    const [table, setTable] = useState('');
    const [query, setQuery] = useState({});
    const [result, setResult] = useState([]);
    const [cols, setCols] = useState({
        users: {
            firstname: true,
            lastname: true,
            email: true,
            role: true
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
                            <Form.Control type="text" onChange={(e) => setQuery({...query, firstname: e.target.value})} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, lastname: e.target.value})} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, email: e.target.value})} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, role: e.target.value})} />
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
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, name: e.target.value})} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Contribution</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, contribution: e.target.value})} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Venue</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, venue: e.target.value})} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Status</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, status: e.target.value})} />
                        </Form.Group>
                    </Col>
                </Row>
            </>
            )}
            {table === 'game' && (
            <>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, date: e.target.value})} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, start_time: e.target.value})} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, end_time: e.target.value})} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Sport</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, sport: e.target.value})} />
                        </Form.Group>
                    </Col>
                </Row>
            </>
            )}
            {table === 'teammanaged' && (
            <>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, date: e.target.value})} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Win Rate</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, start_time: e.target.value})} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" onChange={(e) => setQuery({...query, end_time: e.target.value})} />
                        </Form.Group>
                    </Col>
                </Row>
            </>
            )}
            <Button variant="primary" type="submit" className='mb-3' >
                Return
            </Button>
        </Form>
    )
}

export default Custom