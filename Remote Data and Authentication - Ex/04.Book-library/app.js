
document.getElementById('loadBooks').addEventListener('click', getAllBooks);
document.getElementById('addElement').addEventListener('submit', createBook);
document.querySelector('tbody').addEventListener('click', handleBtns);
getAllBooks();


function handleBtns(event) {
    if (event.target.className == 'editBook') {
        editBook(event.target.id);
    } else if (event.target.className == 'deleteBook') {
        deleteBook(event.target.id);
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
        throw err;
    }
}

function get(url) {
    return request(url, 'get');
}

function post(url, data) {
    return request(url, 'post', data);
}

function edit(url, data) {
    return request(url, 'put', data);
}

function del(url) {
    return request(url, 'delete');
}

async function getAllBooks() {
    const url = 'http://localhost:3030/jsonstore/collections/books';
    const result = await get(url);
    document.querySelector('tbody').replaceChildren(...Object.entries(result).map(([x, y]) => createElement(x, y)));
}

async function createBook(event) {
    event.preventDefault();
    if (event.target.className == 'addNew') {
        const url = 'http://localhost:3030/jsonstore/collections/books';
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const author = formData.get('author');
        try {
            if (title.trim() == '' || author.trim() == '') {
                throw new Error('All fields are required!');
            }
            const result = await post(url, { title, author });
            document.querySelector('tbody').appendChild(createElement(result._id, { title, author }));
            event.target.reset();
        } catch (err) {
            alert(err.message);
        }
    }
}

async function deleteBook(id) {
    const url = `http://localhost:3030/jsonstore/collections/books/${id}`;
    await del(url);
    await getAllBooks();
}

async function editBook(id) {
    const result = await getCurrentBook(id);
    const addForm = document.querySelector('form');

    addForm.getElementsByTagName('input')[0].value = result.title;
    addForm.getElementsByTagName('input')[1].value = result.author;
    addForm.querySelector('input[name="id"]').value = id;
    addForm.classList.remove('addNew');
    addForm.classList.add('editNew');
    addForm.querySelector('button').textContent = 'Save';
    addForm.querySelector('h3').textContent = 'Edit FORM';

    addForm.addEventListener('submit', onEditSubmit);
}

async function onEditSubmit(event) {
    event.preventDefault();
    if (event.target.className == 'editNew') {
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const author = formData.get('author');
        const id = formData.get('id');
        const url = `http://localhost:3030/jsonstore/collections/books/${id}`;

        try {
            if (title.trim() == '' || author.trim() == '') {
                throw new Error('All fields are required!');
            }
            await edit(url, { title, author });
            event.target.reset();
            await getAllBooks();
        } catch (err) {
            alert(err.message);
        }
        event.target.classList.remove('editNew');
        event.target.classList.add('addNew');
        event.target.querySelector('button').textContent = 'Submit';
        event.target.querySelector('h3').textContent = 'FORM';
    }
}

async function getCurrentBook(id) {
    const url = `http://localhost:3030/jsonstore/collections/books/${id}`;
    return get(url, 'get');
}

function createElement(keys, values) {
    const editBtn = e('button', { className: 'editBook', id: keys }, 'Edit');
    const deleteBtn = e('button', { className: 'deleteBook', id: keys }, 'Delete');

    const newBook = e('tr', {},
        e('td', {}, values.title),
        e('td', {}, values.author),
        e('td', {},
            editBtn, deleteBtn));
    return newBook;
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

