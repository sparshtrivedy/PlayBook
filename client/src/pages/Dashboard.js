import React from 'react'
import { Button, Navbar, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import AdminTabs from './AdminTabs'

const Dashboard = () => {
    const navigate = useNavigate()
    return (
        <>
            <Navbar className="px-3 d-flex" style={{'backgroundColor': '#08a7cf'}}>
                <Container>
                    <Navbar.Brand className='text-light'>
                        Sports Manager
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                        <Navbar.Text>
                            Hello, {localStorage.getItem('firstname')}
                        </Navbar.Text>
                        <Button className='mx-3' variant='outline-light' onClick={() => {localStorage.clear(); navigate('/landing')}}>Logout</Button>                        
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className='m-3 text-center'>
                <h2>{localStorage.getItem('role')} Dashboard</h2>
               <AdminTabs />
            </div>
        </>
    )
}

export default Dashboard