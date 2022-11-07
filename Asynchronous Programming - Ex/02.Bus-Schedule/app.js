function solve() {
    const url = 'http://localhost:3030/jsonstore/bus/schedule/';
    const infoElement = document.querySelector('.info');
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');

    let currentStop = {
        next: 'depot',
    }

    function depart() {
        fetch(`${url}${currentStop.next}`)
        .then (res => res.json())
        .then(data => {
            currentStop = Object.assign(data);
            infoElement.textContent = `Next stop ${currentStop.name}`;
        })
        .catch(err => {
            infoElement.textContent = 'Error';
        });   
        departBtn.disabled = true;
        arriveBtn.disabled = false;
    }

    function arrive() {
        infoElement.textContent = `Arriving at ${currentStop.name}`;
        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();