import React, { useEffect, useState } from 'react'
import { Table, Button, Offcanvas, Form, Badge, Modal, Row, Col } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa6'
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [cols, setCols] = useState({
        firstname: true,
        lastname: true,
        email: true,
        role: true,
    });
    const [filterRole, setFilterRole] = useState('');

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleApplyRoleFilter = async () => {
        try {
            fetchFilteredRoles();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleApplyFilter = async () => {
        try {
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.log(error.message);
        }
    }

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

    const handleDeleteUser = async (event) => {
        event.preventDefault();
        const uid = event.target.id.split('_')[1]
        try {
            const response = await axios.delete(`http://localhost:5000/delete-user/${uid}`);
            console.log(response);
            fetchUsers();
            handleAddUserClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users', {params: cols});
            setUsers(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchFilteredRoles = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/filtered-roles/${filterRole}`);
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
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                    Find All
                </Form.Label>
                <Col sm="8">
                    <Form.Select onChange={(e) => setFilterRole(e.target.value)} aria-label="Default select example">
                        <option>Select role</option>
                        <option value="admin">Admins</option>
                        <option value="manager">Managers</option>
                    </Form.Select>
                </Col>
                <Col sm="2" onClick={handleApplyRoleFilter}>
                    <Button variant="primary">Apply filter</Button>
                </Col>
            </Form.Group>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        { users[0] && users[0].firstname && <th>First Name</th> }
                        { users[0] && users[0].lastname && <th>Last Name</th> }
                        { users[0] && users[0].email && <th>Email</th> }
                        { users[0] && users[0].role && <th>Role</th> }
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        return (
                            <tr key={user.uid}>
                                {user.firstname && <td>{user.firstname}</td>}
                                {user.lastname && <td>{user.lastname}</td>}
                                {user.email && <td>{user.email}</td>}
                                {user.role &&
                                    <td>
                                        {user.role === 'manager'? 
                                        <Badge bg="success">Manager</Badge>: 
                                        <Badge bg="primary">Admin</Badge>}
                                    </td>
                                }
                                <td>
                                    <Button id={`edituser_${user.uid}`} variant='warning' size="sm" onClick={handleShow}>Edit</Button>{' '}
                                    <Button id={`deleteuser_${user.uid}`} variant='danger' size="sm" onClick={handleDeleteUser}>Delete</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            <Button variant='outline-success' onClick={handleAddUserShow}>+ Add New User</Button>
            <Button variant="outline-primary" className="m-3" onClick={handleShowModal}>
                <span className='d-flex justify-content-center align-items-center'><FaFilter className='mx-2'/>Filter Columns</span>
            </Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Columns</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <Row>
                        <Col>
                            <Form.Check checked={cols.firstname} type='checkbox' label='First Name' onChange={(e) => setCols({...cols, firstname: e.target.checked})} />
                        </Col>
                        <Col>
                            <Form.Check checked={cols.lastname} type='checkbox' label='Last Name' onChange={(e) => setCols({...cols, lastname: e.target.checked})} />
                        </Col>
                   </Row>
                   <Row>
                        <Col>
                            <Form.Check checked={cols.email} type='checkbox' label='Email' onChange={(e) => setCols({...cols, email: e.target.checked})} />
                        </Col>
                        <Col>
                            <Form.Check checked={cols.role} type='checkbox' label='Role' onChange={(e) => setCols({...cols, role: e.target.checked})} />
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

            <Offcanvas show={show} placement='end' onHide={handleClose}>
                <Offcanvas.Header className='bg-warning' closeButton>
                    <Offcanvas.Title>Edit User</Offcanvas.Title>
                    {user.firstname} {user.lastname}
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
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
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
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
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
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