import { clearUserData, get, getUserData, post } from './api.js';
import { onLogin, onRegister } from './login.js';

function solve() {
    updateUserNav();
    renderInfo();
    renderAllProducts();
    const tbody = document.querySelector('tbody');
    const createFurniture = document.getElementById('create-form');
    const buyBtn = document.getElementById('buyFurniture');
    const allOrderBtn = document.getElementById('show-orders-btn');
    buyBtn.addEventListener('click', onBuy);
    allOrderBtn.addEventListener('click', renderAllProducts)

    if (createFurniture) {
        createFurniture.addEventListener('submit', onCreate);
    }

    async function onBuy(event) {
        const checkedElements = event.target.parentElement.querySelectorAll('input[type="checkbox"]');
        for (let x of checkedElements) {
            if (x.checked) {
                const nameOfFurniture = x.parentElement.parentElement.querySelector('p.nameFurniture').textContent;
                const priceOfFurniture = x.parentElement.parentElement.querySelector('p.priceFurniture').textContent;
                const data = {
                    name: nameOfFurniture,
                    price: priceOfFurniture,
                }
                await post('http://localhost:3030/data/orders', data);
                renderAllProducts();
            }
        };
    }

     async function renderAllProducts() {
        const userData = getUserData();
        const result = await get(`http://localhost:3030/data/orders?where=_ownerId%3D%22${userData.id}%22`);
        let allNames = '';
        let allPrice = 0;
 
        if (result) {
            result.forEach(x => {
                allNames += x.name + ', ';
                allPrice += Number(x.price);
            });
        }
        let resultNames = '';
        allNames !== '' ? resultNames = allNames.substring(0, allNames.length - 2) : resultNames = 'Nothing bought yet!';
        document.getElementById('allNamesFurniture').textContent = resultNames;
        document.getElementById('allPriceFurniture').textContent = (allNames) ? `${allPrice} $` : '0 $';

    }

    function updateUserNav() {
        const userData = getUserData();
        const logoutBtn = document.getElementById('logoutBtn');
        if (userData !== null) {
            document.getElementById('user').style.display = 'inline-block';
            document.getElementById('guest').style.display = 'none';
            logoutBtn.addEventListener('click', onLogout);
        } else {
            document.getElementById('user').style.display = 'none';
            document.getElementById('guest').style.display = 'inline-block';
        }
    }

    function onLogout() {
        get('http://localhost:3030/users/logout');
        clearUserData();
        location.href = './index.html';
    }

    async function renderInfo() {
        const info = await get('http://localhost:3030/data/furniture');
        if (tbody) {
            tbody.replaceChildren(...Object.values(info).map(newFurniture));
        } else {
            document.getElementById('login-form').addEventListener('submit', onLogin);
            document.getElementById('register-form').addEventListener('submit', onRegister);
        }
    }

    async function onCreate(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const entriesOfFormData = Object.fromEntries(formData.entries());
        const values = Object.values(entriesOfFormData);
        if (values.some(x => x == '')) {
            alert('All fields must be filled!');
        } else {
            await post('http://localhost:3030/data/furniture', entriesOfFormData);
            event.target.reset();
            renderInfo();
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

    function newFurniture(furniture) {
        const userData = getUserData();

        const newTrElement = e('tr', {}, e('td', {}, e('img', { src: `${furniture.img}` }, '')),
            e('td', {}, e('p', { className: 'nameFurniture' }, furniture.name)),
            e('td', {}, e('p', { className: 'priceFurniture' }, furniture.price)),
            e('td', {}, e('p', {}, furniture.factor)),
            e('td', {}, e('input', { type: 'checkbox', id: furniture._id, disabled: userData ? false : true })));
        return newTrElement;
    }

}

solve();
