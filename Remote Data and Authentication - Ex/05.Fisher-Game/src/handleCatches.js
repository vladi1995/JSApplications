import {loadCatches, editCatch, createCatch} from './catches.js';

export async function loadAll() {
    const result = await loadCatches();
    const catchesDiv = document.getElementById('catches');
    catchesDiv.replaceChildren(...Object.values(result).map(createElement));
}

export async function handleEdit(id, data) {
    await editCatch(id, data);
    loadAll();
}

export async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target.parentElement.parentElement);

    const angler = formData.get('angler').trim();
    const weight = formData.get('weight').trim();
    const species = formData.get('species').trim();
    const location = formData.get('location').trim();
    const bait = formData.get('bait').trim();
    const captureTime = formData.get('captureTime').trim();

    if (angler == '' || weight == '' || species == '' || location == '' || bait == '' || captureTime == '') {
        return alert('All fields are required!');
    }

    const data = {angler, weight, species, location, bait, captureTime};
    await createCatch(data);
    loadAll();
    event.target.parentElement.parentElement.reset();
}

function createElement(result) {
    const newElement = document.createElement('div');
    newElement.classList.add('catch');
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    newElement.innerHTML = `
    <label>Angler</label>
    <input type="text" class="angler" value="${result.angler}" ${userData && result._ownerId == userData.id ? '' : 'disabled'}>
    <label>Weight</label>
    <input type="text" class="weight" value="${result.weight}" ${userData && result._ownerId == userData.id ? '' : 'disabled'}>
    <label>Species</label>
    <input type="text" class="species" value="${result.species}" ${userData && result._ownerId == userData.id ? '' : 'disabled'}>
    <label>Location</label>
    <input type="text" class="location" value="${result.location}" ${userData && result._ownerId == userData.id ? '' : 'disabled'}>
    <label>Bait</label>
    <input type="text" class="bait" value="${result.bait}" ${userData && result._ownerId == userData.id ? '' : 'disabled'}>
    <label>Capture Time</label>
    <input type="number" class="captureTime" value="${result.captureTime}" ${userData && result._ownerId == userData.id ? '' : 'disabled'}>
    <button class="update" data-id="${result._id}" ${userData !== null && result._ownerId === userData.id ? '' : 'disabled'}>Update</button>
    <button class="delete" data-id="${result._id}" ${userData !== null && result._ownerId === userData.id ? '' : 'disabled'}>Delete</button>
    `;

    return newElement;
}