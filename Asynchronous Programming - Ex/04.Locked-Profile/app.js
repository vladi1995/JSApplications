async function lockedProfile() {
    const url = 'http://localhost:3030/jsonstore/advanced/profiles';
    const response = await fetch(url);
    const data = await response.json();
    let counter = 1;
    const main = document.getElementById('main');
    main.replaceChildren('');
    Object.values(data).forEach(x => {
        const showMoreBtn = e('button', {}, 'Show more');
        const newElement = e('div', { className: 'profile' },
            e('img', { className: 'userIcon', src: './iconProfile2.png' }),
            e('label', {}, 'Lock'),
            e('input', { type: 'radio', name: `user${counter}Locked`, value: 'lock', checked: true }),
            e('label', {}, 'Unlock'),
            e('input', { type: 'radio', name: `user${counter}Locked`, value: 'unlock'}),
            e('br', {}),
            e('hr', {}),
            e('label', {}, 'Username'),
            e('input', { type: 'text', name: `user${counter}Username`, value: x.username, disabled: true, readonly: true }),
            e('div', { className: `hiddenInfo` },
                e('hr', {}),
                e('label', {}, 'Email:'),
                e('input', { type: 'email', name: `user${counter}Email`, value: x.email, disabled: true, readonly: true }),
                e('label', {}, 'Age:'),
                e('input', { type: 'text', name: `user${counter}Age`, value: x.age, disabled: true, readonly: true })),
            showMoreBtn);
        counter++;
        main.appendChild(newElement);

        showMoreBtn.addEventListener('click', showMoreInfo);
    });
}


function showMoreInfo(event){
    const hiddenDiv = event.target.parentElement.querySelector('div');
    const ifUnlocked = event.target.parentElement.querySelectorAll('input[type="radio"]')[1];

    if (ifUnlocked.checked) {
        event.target.disabled = false;
        if (event.target.textContent == 'Hide it') {
            hiddenDiv.classList.add('hiddenInfo');
            event.target.textContent = 'Show more';
        } else if (event.target.textContent == 'Show more') {
            hiddenDiv.classList.remove('hiddenInfo');
            event.target.textContent = 'Hide it';
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