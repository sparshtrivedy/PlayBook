import React from 'react'
import { Button, Navbar, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navbar className="px-3 d-flex" style={{'backgroundColor': '#08a7cf'}}>
                <Container>
                    <Navbar.Brand className='text-light'>
                        Sports Manager
                    </Navbar.Brand>
                </Container>
                <Navbar.Text className='px-3'>Hello, {localStorage.getItem('firstname')}</Navbar.Text>
                <Button variant='outline-light' onClick={() => {localStorage.clear(); navigate('/landing')}}>Logout</Button>
            </Navbar>
            <div className='m-3 text-center'>
                <h2>Dashboard</h2>
               
            </div>
        </>
    )
}

export default Dashboard