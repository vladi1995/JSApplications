import { post } from './app.js';

const form = document.querySelector('form');
form.addEventListener('submit', onLogin);

async function onLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const data = {email, password};

    const result = await post('/users/login', data);
    
    if (email == '' || password == '') {
        return alert('All fields are required!');
    }

    const storeData = {
        id: result._id,
        email: result.email, 
        password: result.password,
        accessToken: result.accessToken,
    }

    if (result) {
        window.location.href = 'index.html';
        sessionStorage.setItem('userData', JSON.stringify(storeData));
    }
}   












