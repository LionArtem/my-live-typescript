import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { topicApi } from '../../utils/TopicApi';
import { notAuthRequest } from '../../utils/NotAuthRequest';

export const fetchAddMessageInTopic = createAsyncThunk(
  'page/fetchAddMessageInTopic',
  async (params, thunkAPI) => {
    const data = await topicApi.addMessageInTopic(params);
    return data;
  }
);

export const fetchDeleteMessage = createAsyncThunk(
  'page/fetchDeleteMessage',
  async (params, thunkAPI) => {
    const data = await topicApi.deleteMessage(params);
    return data;
  }
);

export const fetchGetMessagePaginetion = createAsyncThunk(
  'page/fetchGetMessagePaginetion',
  async (params, thunkAPI) => {
    const data = await notAuthRequest.getMessagePaginetion(params);
    return data;
  }
);

export const fetchGetTopicPaginetion = createAsyncThunk(
  'page/fetchGetTopicPaginetion',
  async (params, thunkAPI) => {
    const data = await notAuthRequest.getTopicPaginetion(params.page);
    return data;
  }
);

export const fetchAddTopic = createAsyncThunk(
  'page/fetchAddTopic',
  async (params, thunkAPI) => {
    const data = await topicApi.addNewTopic(params);
    return data;
  }
);

export const fetchDeleteTopic = createAsyncThunk(
  'page/fetchDeleteTopic',
  async (params, thunkAPI) => {
    const data = await topicApi.deleteTopic(params);
    return data;
  }
);

const initialState = {
  date: '',
  messageValue: '',
  quote: '',
  authorTopic: {},
  titleTopic: '',
  topicsInPage: [],
  numberPages: [],
  showPreloader: false,
  showPreloaderTopic: false,
  successRequest: false,
  textAnswerRequest: '',
  srrTopicServer: false,
  errGetMessage: false,
  showPreloaderMessage: false,
};

const topicsSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    killAllStateTopic(state) {
      state.messageValue = '';
      state.authorTopic = {};
      state.titleTopic = '';
      state.topicsAll = [];
      state.numberPages = [];
      state.showPreloader = false;
      state.successRequest = false;
      state.showPreloaderTopic = false;
      state.srrTopicServer = false;
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
      state.showPreloaderMessage = action.payload;
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
      state.showPreloader = true;
    });
    builder.addCase(fetchAddMessageInTopic.fulfilled, (state, { payload }) => {
      state.showPreloader = false;
    });
    builder.addCase(fetchAddMessageInTopic.rejected, (state, action) => {
      console.log('ошибка отправки message');
      state.showPreloader = false;
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
      state.showPreloaderTopic = true;
    });
    builder.addCase(fetchGetTopicPaginetion.fulfilled, (state, { payload }) => {
      state.topicsInPage = payload.topic;
      state.numberPages = [...new Array(Math.ceil(payload.numberTopics / 10))];
      state.showPreloaderTopic = false;
    });
    builder.addCase(fetchGetTopicPaginetion.rejected, (state, action) => {
      console.log('ошибка загрузки paginetion topic');
      state.showPreloaderTopic = false;
      state.srrTopicServer = true;
    });

    builder.addCase(fetchAddTopic.pending, (state) => {
      //console.log('создание темы');
      state.showPreloader = true;
    });
    builder.addCase(fetchAddTopic.fulfilled, (state, { payload }) => {
      // console.log(payload);
      state.showPreloader = false;
      state.successRequest = true;
      state.textAnswerRequest = 'тема успешно создана';
    });
    builder.addCase(fetchAddTopic.rejected, (state, action) => {
      state.showPreloader = false;
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
  addAuthorTopic,
  setMessageValue,
  killAllStateTopic,
  resetSuccessRequest,
  resetTextAnswerRequest,
  addTextSuccess,
  isShowPreloaderMessage,
  changeErrGetMessage,
  addQuote,
} = topicsSlice.actions;
export default topicsSlice.reducer;
