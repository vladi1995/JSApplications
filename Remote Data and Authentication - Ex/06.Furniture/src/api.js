async function request(url, method, data) {
    const options = {
        method,
        headers: {},
    }

    if (data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const userData = getUserData();

    if (userData != null) {
        options.headers['X-Authorization'] = userData.accessToken;
    }

    const response = await fetch(url, options);

    try {
        if (response.ok == false) {
            if (response.status == 403) {
                clearUserData();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        }
        if (response.status == 204) {
            return response;
        } else {
            const responseData = await response.json();
            return responseData;
        }
    } catch (err) {
        alert(err.message);
        throw err;
    }

}

export function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

export function setUserData(userData) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

export function clearUserData() {
    sessionStorage.removeItem('userData');
}

export function get(url) {
    return request(url, 'get');
}

export function post(url, data) {
    return request(url, 'post', data);
}
