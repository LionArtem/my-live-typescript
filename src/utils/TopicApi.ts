import { MessageTopicParams } from '../redax/slices/topicSlice';
import { URL_SERVER } from './Constants';
import { Params, Headers } from './UserApi';

class TopicApi {
  readonly baseUrl: string;
  readonly headers: Headers;
  constructor({ baseUrl, headers }: Params) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  addNewTopic(title: { title: string }) {
    return fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(title),
    }).then(this._checkResponse);
  }

  getAllTopics() {
    return fetch(this.baseUrl, {
      method: 'get',
      headers: this.headers,
    }).then(this._checkResponse);
  }

  addMessageInTopic(params: MessageTopicParams) {
    const { id, message, userId, token, quote } = params;
    return fetch(`${this.baseUrl}/${id}/message`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userId,
        quote,
      }),
    }).then(this._checkResponse);
  }

  deleteMessage(params: { messageId: string; topicId: string }) {
    const { messageId, topicId } = params;
    return fetch(`${this.baseUrl}/${topicId}/message`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        messageId,
      }),
    }).then(this._checkResponse);
  }

  deleteTopic(params: { id: string }) {
    return fetch(`${this.baseUrl}/${params.id}`, {
      method: 'DELETE',
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

const topicApi = new TopicApi({
  baseUrl: `${URL_SERVER}/topic`,
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
    'content-type': 'application/json',
  },
});

export { topicApi };
