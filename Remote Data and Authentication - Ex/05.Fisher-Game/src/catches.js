import { get, post, put, del } from './app.js';

export function loadCatches() {
    return get('/data/catches');
}

export async function createCatch(data) {
    await post('/data/catches', data);
}

export async function editCatch(id, data) {
    await put('/data/catches/'+id, data);
}

export async function delCatch(id) {
    await del('/data/catches/'+id);
}