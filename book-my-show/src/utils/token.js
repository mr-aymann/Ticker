export const setToken = (data) => {
    return localStorage.setItem('accessToken', data);
}

export const getToken = () => {
    return localStorage.getItem('accessToken');
}

export const clearToken = () => {
    return localStorage.removeItem('accessToken');
}

export const setUser = (data) => {
    return localStorage.setItem('user', JSON.stringify(data));
}

export const getUser = () => {
    const userInfo = localStorage.getItem('user');
    return userInfo ? JSON.parse(userInfo) : null;
}
