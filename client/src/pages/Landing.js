import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { Row, Col, Navbar, Container } from 'react-bootstrap';
import logo from '../logo-white.svg'
import img from '../sport.svg'

const Landing = () => {
    const navigate = useNavigate();
    return (
        <>
        <Navbar className="px-3 d-flex" style={{backgroundColor: '#DCE8E8'}}>
                <Container>
                    <Navbar.Brand className='text-light'>
                        <img src={logo} alt='get-it-together' className='logo' />
                    </Navbar.Brand>
                </Container>
            </Navbar>
        <div className='landing-container'>
            <Col md={10}>
            <Row>
                <Col md={6} className='p-4'>
                    <h1>Sports <span className='text-info'>Management</span> App</h1>
                    <h5>Your winning strategy for seamless sports management</h5>
                    <p className='text-secondary'>
                        Effortlessly manage teams, games, venues, sponsors, players, coaches, and users. Gain insights into coach salaries, game attendance, and more. Filter data with ease. Elevate your sports management with Playbook.
                    </p>
                    <Button variant='info' onClick={() => navigate('/login')}><h4>Login</h4></Button>
                </Col>
                <Col md={6} className='p-4'>
                    <img src={img} alt='sport-image' className='w-100'/>
                </Col>
            </Row>
            </Col>
        </div>
        </>
    )
}

export default Landing