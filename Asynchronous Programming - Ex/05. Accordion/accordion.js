function solution() {
    const main = document.getElementById('main');
    const url = 'http://localhost:3030/jsonstore/advanced/articles/list';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        data.forEach(x => {
            const btnShow = e('button',{className: 'button', id: x._id}, 'More');

            const newElement = e('div', {className: 'accordion'},
                                e('div', {className: 'head'},
                                e('span', {}, x.title), btnShow),
                                e('div', {className: 'extra'},
                                 e('p', {}, '')));

            main.appendChild(newElement);
            btnShow.addEventListener('click', showMore.bind(null, x._id));
        });
    });

    function showMore(id, event) {
        const newUrl = `http://localhost:3030/jsonstore/advanced/articles/details/${id}`;
        fetch(newUrl)
        .then(response => response.json())
        .then(data => {
            event.target.parentElement.parentElement.querySelector('p').textContent = data.content;
        });
        if (event.target.textContent == 'LESS') {
            event.target.textContent = 'MORE';
            event.target.parentElement.parentElement.querySelector('.extra').style.display = 'none';
        } else {
            event.target.textContent = 'LESS';
            event.target.parentElement.parentElement.querySelector('.extra').style.display = 'block';
        }
    }
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

solution();