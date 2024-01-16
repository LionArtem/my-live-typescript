import { AuthApi } from './Auth';
import { URL_SERVER } from './Constants';

class NotAuthRequest {
  readonly baseUrl: string;
  readonly headers: { 'content-type': string };
  constructor({ baseUrl, headers }: AuthApi) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  getTopicPaginetion(page: number) {
    return fetch(`${this.baseUrl}/topicList/${page}`, {
      method: 'GET',
      headers: this.headers,
    }).then(this._checkResponse);
  }

  getMessagePaginetion(params: { id: string; page: number }) {
    const { id, page } = params;
    return fetch(`${this.baseUrl}/messageList/${id}&${page}`, {
      method: 'GET',
      headers: this.headers,
    }).then(this._checkResponse);
  }

  getUserFindId(arrIdUser: string[]) {
    return fetch(
      `${this.baseUrl}/faindIdUsers/${JSON.stringify({ arrIdUser })}`,
      {
        method: 'GET',
        headers: this.headers,
      }
    ).then(this._checkResponse);
  }

  getUserId(id: string) {
    return fetch(`${this.baseUrl}/user/${id}`, {
      method: 'GET',
      headers: this.headers,
    }).then(this._checkResponse);
  }

  _checkResponse = (res: Response) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  };
}

const notAuthRequest = new NotAuthRequest({
  baseUrl: URL_SERVER,
  headers: { 'content-type': 'application/json' },
});

export { notAuthRequest };
