function attachEvents() {
    getAllPhones();
    document.getElementById('btnLoad').addEventListener('click', getAllPhones);
    document.getElementById('btnCreate').addEventListener('click', createPhone);
}

async function getAllPhones() {
    const url = 'http://localhost:3030/jsonstore/phonebook';
    const result = await get(url);
    document.getElementById('phonebook').replaceChildren(...Object.values(result).map(createElement));
}

async function createPhone() {
    const url = 'http://localhost:3030/jsonstore/phonebook';
    const person = document.getElementById('person');
    const phone = document.getElementById('phone');
    try {
        if (person.value == '' || phone.value == '') {
            throw new Error('Missing info');
        }
        const result = await post(url, { person: person.value.trim(), phone: phone.value.trim() });

        person.value = '';
        phone.value = '';
        document.getElementById('phonebook').appendChild(createElement(result));
    } catch (err) {
        alert(err.message);
    }
}

async function request(url, method, data) {
    const options = {
        method,
        headers: {},
    }

    if (data != undefined) {
        options.body = JSON.stringify(data);
        options.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, options);

    try {
        if (response.ok == false) {
            const error = await response.json();
            throw new Error(error.message);
        }
        const responseData = await response.json();
        return responseData;
    } catch (err) {
        alert(err.message);
    }
}

function get(url) {
    return request(url, 'get');
}

function post(url, data) {
    return request(url, 'post', data);
}

function del(url, newElement) {
    newElement.remove();
    return request(url, 'delete');
}

function createElement(data) {
    const url = `http://localhost:3030/jsonstore/phonebook/${data._id}`;
    const newElement = document.createElement('li');
    newElement.textContent = `${data.person}: ${data.phone}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    newElement.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', () => del(url, newElement));
    return newElement;
}


attachEvents();