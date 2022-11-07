const host = 'http://localhost:3030';
import { loadAll } from './handleCatches.js';
import { onSubmit } from './handleCatches.js';
import {delCatch} from './catches.js';
import {handleEdit} from './handleCatches.js';

updateNav();

document.querySelector('.load').addEventListener('click', loadAll);
const userData = JSON.parse(sessionStorage.getItem('userData'));

if (userData !== null) {
    const addBtn = document.querySelector('button.add')
    addBtn.disabled = false;
    addBtn.addEventListener('click', onSubmit);
}

async function request(url, method, data) {
    const options = {
        method,
        headers: {},
    }

    if (data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData != null) {
        options.headers['X-Authorization'] = userData.accessToken;
    }

    const response = await fetch(host + url, options);

    try {
        if (response.ok == false) {
            const error = await response.json();
            throw new Error(error.message);
        }
        return response.json();
    } catch (err) {
        alert(err.message);
    }
}

export async function get(url) {
    return request(url, 'get');
}

export async function post(url, data) {
    return request(url, 'post', data);
}

export async function put(url, data) {
    return request(url, 'put', data);
}

export async function del(url) {
    return request(url, 'delete');
}

function updateNav() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData != null) {
        document.getElementById('user').style.display = 'inline-block';
        document.getElementById('guest').style.display = 'none';
        document.querySelector('.email span').textContent = userData.email;
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline-block';
    }
}

document.getElementById('logout').addEventListener('click', onLogout);

function onLogout() {
    get('/users/logout');
    sessionStorage.removeItem('userData');
    window.location.href = 'index.html';
}

document.querySelector('main').addEventListener('click', handleEditDelete);

async function handleEditDelete(event) {
    if (event.target.className == 'update') {
        const form = event.target.parentElement;

        const angler = form.querySelector('input[class="angler"]').value;
        const weight = form.querySelector('input[class="weight"]').value;
        const species = form.querySelector('input[class="species"]').value;
        const location = form.querySelector('input[class="location"]').value;
        const bait = form.querySelector('input[class="bait"]').value;
        const captureTime = form.querySelector('input[class="captureTime"]').value;
        
        const data = {
            angler,
            weight, 
            species, 
            location,
            bait,
            captureTime,
        }

        handleEdit(event.target.dataset.id, data);
    } else if (event.target.className == 'delete') {
        await delCatch(event.target.dataset.id);
        loadAll();
    }
}
