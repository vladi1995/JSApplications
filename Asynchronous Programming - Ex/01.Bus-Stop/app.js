function getInfo() {
    const busStop = document.getElementById('stopId');
    const url = `http://localhost:3030/jsonstore/bus/businfo/${Number(busStop.value)}`;
    const ulElement = document.getElementById('buses');

    fetch(url)
    .then(res => res.json())
    .then(data => {
        document.getElementById('stopName').textContent = data.name;
        ulElement.innerHTML = '';

        Object.entries(data.buses).forEach(x => {
            const newLiElement = document.createElement('li');
            newLiElement.textContent = `Bus ${x[0]} arrives in ${x[1]} minutes`;
            ulElement.appendChild(newLiElement);
        });
    })
    .catch(err => {
        document.getElementById('stopName').textContent = 'Error';
        ulElement.innerHTML = '';
    });
}
