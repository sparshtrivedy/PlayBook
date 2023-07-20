import React from 'react'
import { Tab, Tabs, Col, Row, Card, Form, Badge } from 'react-bootstrap';
import Users from './Users';
import Teams from './Teams';
import Games from './Games';
import Venues from './Venues';
import { FaUser, FaPeopleGroup, FaBasketball, FaBuilding } from 'react-icons/fa6'

const AdminTabs = () => {
    return (
        <Row>
            <Col md={3} className='mx-auto mb-3'>
                <Card>
                    <Card.Header className='bg-info'>
                        <Card.Title className='m-2'>
                            <h4>{localStorage.getItem('firstname')} {localStorage.getItem('lastname')}</h4>
                        </Card.Title>
                        <Badge bg={`${localStorage.getItem('role') === 'Admin'? 'primary': 'success'}`}>{localStorage.getItem('role')}</Badge>
                    </Card.Header>
                    <Card.Body className='p-0'>
                        <Form.Group className="p-2 bg-light border-bottom">
                            <Form.Label><strong>Username</strong></Form.Label>
                            <Form.Control type="email" defaultValue={localStorage.getItem('username')} disabled/>
                        </Form.Group>
                        <Form.Group className="p-2 bg-light">
                            <Form.Label><strong>Email</strong></Form.Label>
                            <Form.Control type="email" defaultValue={localStorage.getItem('email')} disabled/>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={9} className='mx-auto'>
                <Tabs
                    defaultActiveKey="users"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                > 
                    <Tab eventKey="users" title={<span className='d-flex justify-content-center align-items-center'><FaUser className='mx-2'/>Users</span>}>
                        <Users />
                    </Tab>
                    <Tab eventKey="teams" title={<span className='d-flex justify-content-center align-items-center'><FaPeopleGroup className='mx-2'/>Teams</span>}>
                        <Teams />
                    </Tab>
                    <Tab eventKey="games" title={<span className='d-flex justify-content-center align-items-center'><FaBasketball className='mx-2'/>Games</span>}>
                        <Games />
                    </Tab>
                    <Tab eventKey="venues" title={<span className='d-flex justify-content-center align-items-center'><FaBuilding className='mx-2'/>Venues</span>}>
                        <Venues />
                    </Tab>
                </Tabs>
            </Col>
        </Row>
    );
}

export default AdminTabs