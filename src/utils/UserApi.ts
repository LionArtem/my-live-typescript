import { URL_SERVER } from "./Constants";

type UserMeParams = {
  age: number;
  email: string;
  name: string;
  town: string;
  gender: string;
  params: string;
};

type Headers = {
  authorization: string;
  "content-type": string;
};

interface UserApiParams {
  baseUrl: string;
  headers: Headers;
}

class UserApi {
  readonly baseUrl: string;
  readonly headers: Headers;
  constructor(params: UserApiParams) {
    this.baseUrl = params.baseUrl;
    this.headers = params.headers;
  }

  getUsers(token: string, page: number) {
    return fetch(`${this.baseUrl}/ListUser/${page}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token") || token}`,
        "content-type": "application/json",
      },
    }).then(this._checkResponse);
  }

  deleteUsers(token: string, id: string) {
    return fetch(`${this.baseUrl}/delete/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token") || token}`,
        "content-type": "application/json",
      },
    }).then(this._checkResponse);
  }

  deleteUsersAvatar(token: string, id: string) {
    return fetch(`${this.baseUrl}/delete-avatar/${id}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token") || token}`,
        "content-type": "application/json",
      },
    }).then(this._checkResponse);
  }

  getUserMe(token: string) {
    return fetch(`${this.baseUrl}/me`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token") || token}`,
        "content-type": "application/json",
      },
    }).then(this._checkResponse);
  }

  patchUserMe(params: UserMeParams) {
    const token = params.params;
    return fetch(`${this.baseUrl}/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token") || token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        age: params.age,
        email: params.email,
        name: params.name,
        town: params.town,
        gender: params.gender,
      }),
    }).then(this._checkResponse);
  }

  addAvatar(file: File, token: string): Promise<any> {
    return fetch(`${this.baseUrl}/add-file`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token") || token}`,
      },
      body: file,
    }).then(this._checkResponse);
  }

  _checkResponse = (res: Response) => {
    if (res.ok) {
      return res.json();
    }
    return res.text().then((err) => Promise.reject(JSON.parse(err)));
  };
}

const usersApi = new UserApi({
  baseUrl: `${URL_SERVER}/users`,
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    "content-type": "application/json",
  },
});

export { usersApi };
