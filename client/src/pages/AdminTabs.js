import React from 'react'
import { Tab, Tabs, Col, Row, Card, Form, Badge } from 'react-bootstrap';
import Users from './Users';
import Teams from './Teams';
import Games from './Games';
import Venues from './Venues';
import Custom from './Custom';
import { FaUser, FaPeopleGroup, FaBasketball, FaBuilding, FaHandPointer } from 'react-icons/fa6'

const AdminTabs = () => {
    return (
        <Row>
            <Col md={3} className='mx-auto mb-3'>
                <Col md={11}>
                    <Card>
                        <Card.Header className='bg-info p-3'>
                            <div>
                                <FaUser className='bg-light rounded-circle pt-2' color='lightGray' size={50} />
                            </div>
                            <div>
                                <Card.Title className='m-2'>
                                    <h4 className='text-light'>{localStorage.getItem('firstname')} {localStorage.getItem('lastname')}</h4>
                                </Card.Title>
                            </div>
                            <div>
                                <Badge bg={`${localStorage.getItem('role') === 'Admin'? 'primary': 'success'}`}>{localStorage.getItem('role')}</Badge>
                            </div>
                        </Card.Header>
                        <Card.Body className='p-0'>
                            <Form.Group className="p-2 bg-light border-bottom">
                                <Form.Label><strong>Email</strong></Form.Label>
                                <Form.Control type="email" defaultValue={localStorage.getItem('email')} disabled/>
                            </Form.Group>
                            <Form.Group className="p-2 bg-light">
                                <Form.Label><strong>First Name</strong></Form.Label>
                                <Form.Control type="text" defaultValue={localStorage.getItem('firstname')} disabled/>
                            </Form.Group>
                            <Form.Group className="p-2 bg-light">
                                <Form.Label><strong>Last Name</strong></Form.Label>
                                <Form.Control type="text" defaultValue={localStorage.getItem('lastname')} disabled/>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Col>
            <Col md={9} className='mx-auto'>
                <Tabs
                    defaultActiveKey="users"
                    id="fill-tab-example"
                    className="mb-3 myclass"
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
                    <Tab eventKey="custom" title={<span className='d-flex justify-content-center align-items-center'><FaHandPointer className='mx-2'/>Custom</span>}>
                        <Custom />
                    </Tab>
                </Tabs>
            </Col>
        </Row>
    );
}

export default AdminTabs