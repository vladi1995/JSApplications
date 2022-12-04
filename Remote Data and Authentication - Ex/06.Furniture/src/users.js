import { post, setUserData } from './api.js';

export async function login(email, password) {
    const result = await post('http://localhost:3030/users/login', {email, password});
    const userData = {
        id: result._id,
        email: result.email,
        accessToken: result.accessToken,
    }
    setUserData(userData);
    return result;
}

export async function register(email, password) {
    const result = await post('http://localhost:3030/users/register', {email, password});
    const userData = {
        id: result._id,
        email: result.email,
        accessToken: result.accessToken,
    }
    setUserData(userData);
    return result;
}


