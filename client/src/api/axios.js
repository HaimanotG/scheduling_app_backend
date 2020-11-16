import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    timeout: 5000,
    headers: {}
});

export default instance;