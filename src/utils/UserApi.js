import { URL_SERVER } from "./Constants";

class UserApi {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  getUsers(token, page) {
    return fetch(`${this.baseUrl}/ListUser/${page}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  deleteUsers(token, id) {
    return fetch(`${this.baseUrl}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  deleteUsersAvatar(token, id) {
    return fetch(`${this.baseUrl}/delete-avatar/${id}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  getUserMe(token) {
    return fetch(`${this.baseUrl}/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  patchUserMe(age, email, name, town, gender, params) {
    const token = params;
    return fetch(`${this.baseUrl}/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ age, email, name, town, gender }),
    }).then(this._checkResponse);
  }

  addAvatar(file, token) {
    return fetch(`${this.baseUrl}/add-file`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
      },
      body: file,
    }).then(this._checkResponse);
  }

  _checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    }
    return res.text().then((err) => Promise.reject(JSON.parse(err)));
  };
}

const usersApi = new UserApi({
  baseUrl: `${URL_SERVER}/users`,
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
    'content-type': 'application/json',
  },
});

export { usersApi };
