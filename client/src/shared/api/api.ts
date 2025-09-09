import axios from 'axios';
import { USER_LOCALSTORAGE_KEY } from '@/shared/const/localstorage';

// Prefer VITE_API_URL when provided, otherwise default to same-origin '/api'.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const $api = axios.create({
    baseURL: API_BASE,
});

$api.interceptors.request.use((config) => {
    if (config.headers) {
        config.headers.Authorization = localStorage.getItem(USER_LOCALSTORAGE_KEY) || '';
    }
    return config;
});
