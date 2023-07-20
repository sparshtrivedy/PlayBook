import React from 'react'
import { Button, Navbar, Container, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import AdminTabs from './AdminTabs'
import logo from '../logo-blue.svg'
import { FaArrowRightFromBracket } from 'react-icons/fa6'

const Dashboard = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navbar className="px-3 d-flex" style={{'backgroundColor': '#08a7cf'}}>
                <Container>
                    <Navbar.Brand className='text-light'>
                        <img src={logo} alt='get-it-together' className='logo' />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className="d-flex align-items-end justify-content-end">
                        <div>
                            <Navbar.Text>
                                <h5>👋 Hello, {localStorage.getItem('firstname')}!</h5>
                            </Navbar.Text>
                        </div>
                        <div>
                            <Button className='mx-3 d-inline-flex align-items-center' variant='outline-light' onClick={() => {localStorage.clear(); navigate('/landing')}}>
                                <span className='mx-2'>Logout</span>
                                <FaArrowRightFromBracket />
                            </Button>
                        </div>                       
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Col className='m-3 text-center mx-auto' md={11}>
                <h2 className='m-4'>{localStorage.getItem('role')} Dashboard</h2>
                <AdminTabs />
            </Col>
        </>
    )
}

export default Dashboard