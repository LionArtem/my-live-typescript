import { URL_SERVER } from './Constants';

type UserMeParams = {
  age: number;
  email: string;
  name: string;
  town: string;
  gender: string;
  token: string;
};

export type Headers = {
  authorization: string;
  'content-type': string;
};

export interface Params {
  baseUrl: string;
  headers: Headers;
}

class UserApi {
  readonly baseUrl: string;
  readonly headers: Headers;
  constructor(params: Params) {
    this.baseUrl = params.baseUrl;
    this.headers = params.headers;
  }

  public getUsers(token: string, page: number) {
    return fetch(`${this.baseUrl}/ListUser/${page}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  public deleteUsers(token: string, id: string) {
    return fetch(`${this.baseUrl}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  public deleteUsersAvatar(token: string, id: string) {
    return fetch(`${this.baseUrl}/delete-avatar/${id}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  public getUserMe({ token }: { token: string }) {
    return fetch(`${this.baseUrl}/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
    }).then(this._checkResponse);
  }

  public patchUserMe(params: UserMeParams) {
    const token = params.token;
    return fetch(`${this.baseUrl}/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
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

  public addAvatar(avatar: FormData, token: string): Promise<any> {
    return fetch(`${this.baseUrl}/add-file`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
      },
      body: avatar,
    }).then(this._checkResponse);
  }

  protected _checkResponse = (res: Response) => {
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
