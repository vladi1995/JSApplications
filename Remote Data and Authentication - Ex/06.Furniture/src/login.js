import {login, register} from './users.js';

export async function onLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    if (email == '' || password == '') {
        return alert('All fields are required!');
    }
    const result = await login(email, password);
    if (result.accessToken) {
        location.href='./homeLogged.html';
    }
}

export async function onRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const repass = formData.get('rePass')
    if (email == '' || password == '') {
        return alert('All fields are required!');
    }
    if (password !== repass) {
        return alert('Passwords don\'t match!');
    }
    const result = await register(email, password);
    if (result.accessToken) {
        location.href='./homeLogged.html';
    }
}