import { URL_SERVER } from './Constants';

class Auth {
  readonly baseUrl: string;
  readonly headers: { 'content-type': string };
  constructor({
    baseUrl,
    headers,
  }: {
    baseUrl: string;
    headers: { 'content-type': string };
  }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  addUser(email: string, password: string) {
    return fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(this._checkResponse);
  }

  loginUser(email: string, password: string) {
    return fetch(`${this.baseUrl}/signin`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(this._checkResponse);
  }

  _checkResponse = (res: Response) => {
    if (res.ok) {
      return res.json();
    }
    return res.text().then((err) => Promise.reject(JSON.parse(err)));
  };
}

const auth = new Auth({
  baseUrl: URL_SERVER,
  headers: { 'content-type': 'application/json' },
});

export { auth };
