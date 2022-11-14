function attachEvents() {
    const submitBtn = document.getElementById('submit');
    const refreshBtn = document.getElementById('refresh');
    
    submitBtn.addEventListener('click', sendElement);
    refreshBtn.addEventListener('click', refreshDocument);
}

async function sendElement(event) {
    const url = 'http://localhost:3030/jsonstore/messenger';
    const author = document.querySelector('input[name="author"]');
    const content = document.querySelector('input[name="content"]');
    const data = await postElement(url, {author:author.value.trim(), content: content.value.trim()});
}

async function refreshDocument(event) {
    const url = 'http://localhost:3030/jsonstore/messenger';
    const data = await getElement(url);
    const arr = [];
    Object.values(data).map(x => arr.push(`${x.author}: ${x.content}`));
    document.getElementById('messages').replaceChildren(arr.join('\n'));
}

async function request(url, method, data) {
    const options = {
        method,
        headers: {},
    }

    if (data != undefined) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch (url, options);
    const responseData = await response.json();

    return responseData;
}

function postElement(url, data) {
    return request(url, 'post', data);
}

function getElement(url) {
    return request(url, 'get');
}

attachEvents();