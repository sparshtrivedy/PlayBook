import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'? '': 'http://localhost:5000';

const api = axios.create({
    baseURL
});

export default api;
