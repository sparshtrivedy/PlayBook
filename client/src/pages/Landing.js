import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();
    return (
        <>
            <div>Hello</div>
            <Button onClick={() => navigate('/login')}>Login</Button>
        </>
    )
}

export default Landing