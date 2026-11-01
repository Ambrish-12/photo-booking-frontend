import axios from 'axios';

// Uses Vercel's env variable in production, falls back to localhost:8080 in dev
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchServices = async () => {
    const response = await api.get('/services');
    return response.data;
};

export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const fetchBookings = async (email = '') => {
    const params = email ? { email } : {};
    const response = await api.get('/bookings', { params });
    return response.data;
};

export default api;