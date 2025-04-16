import { toast } from 'react-toastify';

export const notify = (message, type) => {
    toast[type](message);
}

export const API_URL = 'https://taskmanager-backend-production-6967.up.railway.app';
