async function solve() {
    const url = 'http://localhost:3030/jsonstore/collections/students';
    document.getElementById('form').addEventListener('submit', onSubmit);
    const result = await get(url);
    const tbody = document.querySelector('tbody');
    tbody.replaceChildren(...Object.values(result).map(createElement));
}

async function onSubmit(event) {
    event.preventDefault();
    const url = 'http://localhost:3030/jsonstore/collections/students';
    const tbody = document.querySelector('tbody');
    const formData = new FormData(event.target);
    const values = Array.from(formData.values());
    try {
        if (values.some(x => x == '')) {
            throw new Error('All fields are required!');
        }
        const obj = {
            firstName: values[0],
            lastName: values[1],
            facultyNumber: values[2],
            grade: values[3]
        };
        await post(url, obj);
        tbody.appendChild(createElement(obj))
        event.target.reset();
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
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
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

function createElement(data) {
    const newElement = e('tr', {},
        e('td', {}, data.firstName),
        e('td', {}, data.lastName),
        e('td', {}, data.facultyNumber),
        e('td', {}, data.grade));

    return newElement;
}

function e(type, attr, ...content) {
    const newElement = document.createElement(type);

    for (let el in attr) {
        newElement[el] = attr[el];
    }

    for (let el of content) {
        if (typeof el == 'string' || typeof el == 'number') {
            el = document.createTextNode(el);
        }
        newElement.appendChild(el);
    }

    return newElement;
}

solve();