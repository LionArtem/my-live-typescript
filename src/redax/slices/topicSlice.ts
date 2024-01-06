import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { topicApi } from '../../utils/TopicApi';
import { notAuthRequest } from '../../utils/NotAuthRequest';
import { Message, User } from './userSlice';

interface MessageTopicParams {
  id: string;
  message: string;
  userId: string;
  token: string;
  quote: string;
}

interface MessageTopicData {
  createdAt: string;
  messages: Message[];
  owner: string;
  title: string;
  __v: number;
  _id: string;
}

type MessageDeleteParams = {
  messageId: string;
  topicId: string;
};
type MessagePaginetionParams = {
  id: string;
  page: number;
};

interface MessagePaginetionData {
  createdAt: string;
  messages: Message[];
  numberMessages: number;
  title: string;
  user: User;
}

type Topic = {
  createdAt: string;
  messages: Message[];
  owner: string;
  title: string;
  __v: number;
  _id: string;
};

interface TopicData {
  numberTopics: number;
  topic: Topic;
}

export const fetchAddMessageInTopic = createAsyncThunk<
  MessageTopicData,
  MessageTopicParams
>('page/fetchAddMessageInTopic', async (params) => {
  const data = await topicApi.addMessageInTopic(params);
  return data;
});

export const fetchDeleteMessage = createAsyncThunk<
  MessageTopicData,
  MessageDeleteParams
>('page/fetchDeleteMessage', async (params) => {
  const data = await topicApi.deleteMessage(params);
  return data;
});

export const fetchGetMessagePaginetion = createAsyncThunk<
  MessagePaginetionData,
  MessagePaginetionParams
>('page/fetchGetMessagePaginetion', async (params) => {
  const data = await notAuthRequest.getMessagePaginetion(params);
  return data;
});

export const fetchGetTopicPaginetion = createAsyncThunk<
  TopicData,
  { page: number }
>('page/fetchGetTopicPaginetion', async (params) => {
  const data = await notAuthRequest.getTopicPaginetion(params.page);
  return data;
});

export const fetchAddTopic = createAsyncThunk<Topic, { title: string }>(
  'page/fetchAddTopic',
  async (params) => {
    const data = await topicApi.addNewTopic(params);
    return data;
  }
);

export const fetchDeleteTopic = createAsyncThunk<Topic, { id: string }>(
  'page/fetchDeleteTopic',
  async (params) => {
    const data = await topicApi.deleteTopic(params);
    return data;
  }
);

interface TopicState {
  date: string;
  messageValue: string;
  quote: string;
  authorTopic: User | null;
  titleTopic: string;
  topicsInPage: Topic[];
  numberPages: number[];
  preloader: boolean;
  preloaderTopic: boolean;
  successRequest: boolean;
  textAnswerRequest: string;
  errTopicServer: boolean;
  errGetMessage: boolean;
  preloaderMessage: boolean;
}

const initialState: TopicState = {
  date: '',
  messageValue: '',
  quote: '',
  authorTopic: null,
  titleTopic: '',
  topicsInPage: [],
  numberPages: [],
  preloader: false,
  preloaderTopic: false,
  successRequest: false,
  textAnswerRequest: '',
  errTopicServer: false,
  errGetMessage: false,
  preloaderMessage: false,
};

const topicsSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    killAllStateTopic(state) {
      state.messageValue = '';
      state.authorTopic = {};
      state.titleTopic = '';
      //state.topicsAll = [];
      state.numberPages = [];
      state.preloader = false;
      state.successRequest = false;
      state.preloaderTopic = false;
      state.errTopicServer = false;
      state.errGetMessage = false;
      state.date = '';
      state.quote = '';
    },
    addQuote(state, action) {
      state.quote = action.payload;
    },
    changeErrGetMessage(state, action) {
      state.errGetMessage = action.payload;
    },
    resetTextAnswerRequest(state) {
      state.textAnswerRequest = '';
    },
    isShowPreloaderMessage(state, action) {
      state.preloaderMessage = action.payload;
    },
    resetSuccessRequest(state) {
      state.successRequest = false;
    },
    setMessageValue(state, action) {
      state.messageValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAddMessageInTopic.pending, (state) => {
      //console.log('отправка message');
      state.preloader = true;
    });
    builder.addCase(fetchAddMessageInTopic.fulfilled, (state, { payload }) => {
      state.preloader = false;
    });
    builder.addCase(fetchAddMessageInTopic.rejected, (state, action) => {
      console.log('ошибка отправки message');
      state.preloader = false;
      state.textAnswerRequest = 'при отправки сообщения произошла ошибка';
    });

    builder.addCase(fetchDeleteMessage.pending, (state) => {
      console.log('удаление message');
    });
    builder.addCase(fetchDeleteMessage.fulfilled, (state, { payload }) => {
      //console.log(payload);
    });
    builder.addCase(fetchDeleteMessage.rejected, (state, action) => {
      console.log('ошибка удаления message');
    });

    builder.addCase(fetchGetMessagePaginetion.pending, (state) => {
      //console.log('загрузка paginetion message');
    });
    builder.addCase(
      fetchGetMessagePaginetion.fulfilled,
      (state, { payload }) => {
        state.date = payload.createdAt;
        state.titleTopic = payload.title;
        state.authorTopic = payload.user;
        state.numberPages = [
          ...new Array(
            Math.ceil(
              payload.numberMessages % 10 === 0
                ? payload.numberMessages / 10 + 1
                : payload.numberMessages / 10
            )
          ),
        ];
      }
    );
    builder.addCase(fetchGetMessagePaginetion.rejected, (state, action) => {
      console.log('ошибка загрузки paginetion message');
      state.errGetMessage = true;
    });

    builder.addCase(fetchGetTopicPaginetion.pending, (state) => {
      //console.log('загрузка paginetion topics');
      state.preloaderTopic = true;
    });
    builder.addCase(fetchGetTopicPaginetion.fulfilled, (state, { payload }) => {
      state.topicsInPage = payload.topic;
      state.numberPages = [...new Array(Math.ceil(payload.numberTopics / 10))];
      state.preloaderTopic = false;
    });
    builder.addCase(fetchGetTopicPaginetion.rejected, (state, action) => {
      console.log('ошибка загрузки paginetion topic');
      state.preloaderTopic = false;
      state.errTopicServer = true;
    });

    builder.addCase(fetchAddTopic.pending, (state) => {
      //console.log('создание темы');
      state.preloader = true;
    });
    builder.addCase(fetchAddTopic.fulfilled, (state, { payload }) => {
      // console.log(payload);
      state.preloader = false;
      state.successRequest = true;
      state.textAnswerRequest = 'тема успешно создана';
    });
    builder.addCase(fetchAddTopic.rejected, (state, action) => {
      state.preloader = false;
      state.textAnswerRequest = 'при создании темы на сервере произошла ошибка';
      // console.log(action);
      console.log('ошибка создания темы');
    });

    builder.addCase(fetchDeleteTopic.pending, (state) => {
      //console.log('удаление темы');
    });
    builder.addCase(fetchDeleteTopic.fulfilled, (state, { payload }) => {
      //console.log(payload);
    });
    builder.addCase(fetchDeleteTopic.rejected, (state, action) => {
      // console.log(action);
      //console.log('ошибка удаления темы');
    });
  },
});

export const selectTopics = (state) => state.topics;
export const {
  // addAuthorTopic,
  setMessageValue,
  killAllStateTopic,
  resetSuccessRequest,
  resetTextAnswerRequest,
  //addTextSuccess,
  isShowPreloaderMessage,
  changeErrGetMessage,
  addQuote,
} = topicsSlice.actions;
export default topicsSlice.reducer;
