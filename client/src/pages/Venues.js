import React, { useEffect, useState } from 'react'
import { Table, Button, Form, Offcanvas } from 'react-bootstrap';
import axios from 'axios';

const Venues = () => {
    const [venues, setVenues] = useState([]);
    const [venue, setVenue] = useState({});
    const [show, setShow] = useState(false);
    const [sponsors, setSponsors] = useState([]);
    const [showAddVenue, setShowAddVenue] = useState(false);
    const [showSponsors, setShowSponsors] = useState(false);

    const handleShow = async (e) => {
        const vid = e.target.id.split('_')[1];
        setVenue(venues.filter(venue => venue.vid === vid)[0])
        setShow(true);
    }

    const handleClose = () => setShow(false);

    const handleSponsorsShow = async (e) => {
        const vid = e.target.id.split('_')[1];
        setVenue(venues.filter(venue => venue.vid === vid)[0]);
        setShowSponsors(true);
    }

    useEffect(() => {
        const fetchSponsors = async () => {
            console.log(venue.vid)
            try {
                const response = await axios.get(`http://localhost:5000/sponsors/${venue.vid}`);
                setSponsors(response.data);
            } catch (error) {
                console.log(error.message);
            }
        }

        fetchSponsors();
    }, [venue])

    const handleSponsorsClose = () => setShowSponsors(false);

    const handleAddShow = async (e) => {
        setShowAddVenue(true);
    }

    const handleAddClose = () => setShowAddVenue(false);

    const fetchVenues = async () => {
        try {
            const response = await axios.get('http://localhost:5000/venues');
            setVenues(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put('http://localhost:5000/update-venue', venue);
            console.log(response);
            fetchVenues();
            handleClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleAddSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/add-venue', venue);
            console.log(response);
            fetchVenues();
            handleAddClose();
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchVenues();
    }, []);

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>City</th>
                        <th>Capacity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {venues.map((venue) => {
                        return (
                            <tr key={(venue.vid).toString().split('T')[0]}>
                                <td>{venue.name}</td>
                                <td>{venue.city}</td>
                                <td>{venue.capacity}</td>
                                <td>
                                    <Button id={`editvenue_${venue.vid}`} variant='warning' size="sm" onClick={handleShow}>Edit</Button>{' '}
                                    <Button id={`deletevenue_${venue.vid}`} variant='danger' size="sm">Delete</Button>{' '}
                                    <Button id={`viewsponsors_${venue.vid}`} variant='primary' size="sm" onClick={handleSponsorsShow}>Sponsors</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            <Button variant='outline-success' onClick={handleAddShow}>+ Add New Venue</Button>

            <Offcanvas show={show} placement='end' onHide={handleClose}>
                <Offcanvas.Header className='bg-warning' closeButton>
                    <Offcanvas.Title>Edit Venue</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control defaultValue={venue.name} type="text" placeholder="Enter Name" onChange={(e) => setVenue({...venue, name: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>City</Form.Label>
                            <Form.Control defaultValue={venue.city} type="text" placeholder="Enter City" onChange={(e) => setVenue({...venue, city: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control defaultValue={venue.capacity} type="text" placeholder="Enter Capacity" onChange={(e) => setVenue({...venue, capacity: e.target.value})} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={showAddVenue} placement='end' onHide={handleAddClose}>
                <Offcanvas.Header className='bg-success' closeButton>
                    <Offcanvas.Title className='text-light'>Add Venue</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleAddSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Name" onChange={(e) => setVenue({...venue, name: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="Enter City" onChange={(e) => setVenue({...venue, city: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control type="text" placeholder="Enter Capacity" onChange={(e) => setVenue({...venue, capacity: e.target.value})} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <Offcanvas show={showSponsors} placement='bottom' onHide={handleSponsorsClose}>
                <Offcanvas.Header className='bg-primary' closeButton>
                    <Offcanvas.Title className='text-light'>Sponsors</Offcanvas.Title>
                    <div className='text-light'>{venue.name}</div>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Sponsor</th>
                                <th>Contribution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sponsors.map((sponsor) => {
                                return (
                                    <tr key={sponsor.sid}>
                                        <td>{sponsor.name}</td>
                                        <td>{sponsor.contribution}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default Venues