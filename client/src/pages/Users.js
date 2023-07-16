import React, { useEffect, useState } from 'react'
import { Table, Button, Offcanvas, Form, Badge } from 'react-bootstrap';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = async (e) => {
        const id = e.target.id.split('_')[1]
        setUser(users.filter(user => user.uid === id)[0])
        setShow(true);
    }

    const handleAddUserClose = () => setShowAddUser(false);

    const handleAddUserShow = async (e) => {
        setShowAddUser(true);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put('http://localhost:5000/update-user', user);
            console.log(response);
            fetchUsers();
            handleClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmitAddUser = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/add-user', user);
            console.log(response);
            fetchUsers();
            handleAddUserClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        return (
                            <tr key={user.uid}>
                                <td>{user.username}</td>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role? 
                                    <Badge bg="success">Manager</Badge>: 
                                    <Badge bg="primary">Admin</Badge>}
                                </td>
                                <td>
                                    <Button id={`edituser_${user.uid}`} variant='warning' size="sm" onClick={handleShow}>Edit</Button>{' '}
                                    <Button id={`deleteuser_${user.uid}`} variant='danger' size="sm">Delete</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            <Button variant='outline-success' onClick={handleAddUserShow}>+ Add New User</Button>

            <Offcanvas show={show} placement='end' onHide={handleClose}>
                <Offcanvas.Header className='bg-warning' closeButton>
                    <Offcanvas.Title>Edit User</Offcanvas.Title>
                    {user.username}
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control defaultValue={user.username} type="text" placeholder="Enter Username" onChange={(e) => setUser({...user, username: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control defaultValue={user.firstname} type="text" placeholder="Enter First Name" onChange={(e) => setUser({...user, firstname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control defaultValue={user.lastname} type="text" placeholder="Enter Last Name" onChange={(e) => setUser({...user, lastname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Email</Form.Label>
                            <Form.Control defaultValue={user.email} type="email" placeholder="Enter Email" onChange={(e) => setUser({...user, email: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control defaultValue={user.password} type="text" placeholder="Enter Password" onChange={(e) => setUser({...user, password: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Role</Form.Label>
                            <Form.Select defaultValue={user.role} onChange={(e) => setUser({...user, role: e.target.value})}>
                                <option>Select role</option>
                                <option value="0">Admin</option>
                                <option value="1">Manager</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
                
            </Offcanvas>

            <Offcanvas show={showAddUser} placement='end' onHide={handleAddUserClose}>
                <Offcanvas.Header className='bg-success' closeButton>
                    <Offcanvas.Title className='text-light'>Add User</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmitAddUser}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter Username" onChange={(e) => setUser({...user, username: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter First Name" onChange={(e) => setUser({...user, firstname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Last Name" onChange={(e) => setUser({...user, lastname: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email" onChange={(e) => setUser({...user, email: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="text" placeholder="Enter Password" onChange={(e) => setUser({...user, password: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Role</Form.Label>
                            <Form.Select onChange={(e) => setUser({...user, role: e.target.value})}>
                                <option>Select Role</option>
                                <option value="0">Admin</option>
                                <option value="1">Manager</option>
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

export default Users