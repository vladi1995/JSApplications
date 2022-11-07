function attachEvents() {
    const location = document.getElementById('location');
    const btn = document.getElementById('submit');
    const foreCastElement = document.getElementById('forecast');
    const currentDiv = document.getElementById('current');
    const upcomingDiv = document.getElementById('upcoming');

    btn.addEventListener('click', onSearch);

    async function onSearch(event) {
        event.preventDefault();
        const foundLocationsAll = await request('http://localhost:3030/jsonstore/forecaster/locations');
        const searchedLocation = foundLocationsAll.find(x => x.name == location.value.trim());

        if (searchedLocation == undefined) {
            foreCastElement.style.display = 'block';
            foreCastElement.innerHTML = 'Error';
        } else {
            const currentConditions = await request(`http://localhost:3030/jsonstore/forecaster/today/${searchedLocation.code}`);
            const threeDay = await request(`http://localhost:3030/jsonstore/forecaster/upcoming/${searchedLocation.code}`);
           
            const objOfCodes = {
                'Sunny': '\u2600',
                'Partly sunny': '\u26C5',
                'Overcast': '\u2601',
                'Rain': '\u2614',
                'Degrees': '\xB0',
            }
            foreCastElement.style.display = 'block';
           
            const forecastsDiv = e('div', { className: 'forecasts' },
                e('span', { className: 'condition symbol' }, objOfCodes[currentConditions.forecast.condition]),
                e('span', { className: 'condition' },
                    e('span', { className: 'forecast-data' }, currentConditions.name),
                    e('span', { className: 'forecast-data' }, currentConditions.forecast.low + objOfCodes['Degrees'] + '/' + currentConditions.forecast.high + objOfCodes['Degrees']),
                    e('span', { className: 'forecast-data' }, currentConditions.forecast.condition)));
                    currentDiv.appendChild(forecastsDiv);

            const forecastInfoDiv = e('div', {className: 'forecast-info'});
            upcomingDiv.appendChild(forecastInfoDiv);
            Object.values(threeDay.forecast).forEach(x => {
                const newElement = e('span', {className: 'upcoming'}, 
                e('span', {className: 'symbol'}, objOfCodes[x.condition]),
                e('span', {className: 'forecast-data'}, x.low + objOfCodes['Degrees'] + '/' + x.high + objOfCodes['Degrees']),
                e('span', {className: 'forecast-data'}, x.condition));
 
                forecastInfoDiv.appendChild(newElement);
            });     
        }
        location.value = '';
    }

    async function request(url) {
        const response = await fetch(url);
        try {
            if (response.ok == false || response.status != 200) {
                throw new Error('Error');
            }
            const responseData = await response.json();
            return responseData;
        } catch (err) {
            document.getElementById('forecast').innerHTML = err.message;
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
}

attachEvents();