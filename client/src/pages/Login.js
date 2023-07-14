import { useState } from 'react';
import { Button, Form, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: username,
        password: password
      });

      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('firstname', response.data.user.firstname);
      localStorage.setItem('lastname', response.data.user.lastname);
      localStorage.setItem('email', response.data.user.email);
      localStorage.setItem('token', response.data.token);

      navigate('/dashboard');
    } catch (error) {
      setShowAlert(true);
      console.log(error.message);
    }
  };

  return (
    <Card className='m-4 bg-light'>
      <Card.Header style={{'backgroundColor': '#08a7cf'}}>
        <h4 className='text-light text-center'>
          Login
        </h4>
      </Card.Header>
      <Alert variant='danger' className='m-3 p-2' show={showAlert}>
        The username and password combination you have entered is incorrect
      </Alert>
      <Form onSubmit={handleSubmit}>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
        </Card.Body>
        <Card.Footer className='d-flex justify-content-center' style={{'backgroundColor': '#08a7cf'}}>
          <Button variant="outline-light" type="submit">
            Login
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  );
}

export default Login;