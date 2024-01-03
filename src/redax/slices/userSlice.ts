import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { usersApi } from "../../utils/UserApi";
import { notAuthRequest } from "../../utils/NotAuthRequest";
import { FormValidetionValue } from "./formValidetionSlice";

type UserPathParams = {
  town: string;
  token: string;
};

export interface User {
  admin: boolean;
  age: number;
  avatar?: string;
  email: string;
  gender: string;
  name: string;
  town: string;
  __v: number;
  _id: string;
}

interface UserFindIdProps {
  arrIdUser: string[];
  messages: Topic;
}

type Message = {
  createdAt: string;
  message: string;
  quote: string;
  userId: string;
  _id: string;
};

interface Topic {
  createdAt: string;
  messages: Message[];
  numberMessages: number;
  title: string;
  user: User;
}

interface UserFindIdData {
  data: User[];
  topic: Topic;
}

export const fetchGetUser = createAsyncThunk(
  "page/fetchGetUser",
  async (params: string) => {
    const data: User = await usersApi.getUserMe(params);
    return data;
  }
);

export const fetchPatchUser = createAsyncThunk<
  User,
  UserPathParams,
  {
    state: {
      formValidetion: {
        value: FormValidetionValue;
      };
    };
  }
>("page/fetchPatchUser", async (params, thunkAPI) => {
  const { age, email, name, gender } = thunkAPI.getState().formValidetion.value;
  const { token, town } = params;

  const data = await usersApi.patchUserMe({
    age,
    email,
    name,
    town,
    gender,
    token,
  });

  return data;
});

// export const fetchGetUserId = createAsyncThunk<User, Id>(
//   "page/fetchGetUserId",
//   async (params) => {
//     const data = await usersApi.getUserId(params.id);
//     return data;
//   }
// );

export const fetchGetUserFindId = createAsyncThunk<
  UserFindIdData,
  UserFindIdProps
>("page/fetchGetUserFindId", async (params) => {
  const data = await notAuthRequest.getUserFindId(params.arrIdUser);
  return { data, topic: params.messages };
});

const initialState = {
  user: {},
  admin: localStorage.getItem("admin"),
  allMessagesAndAuthors: [],
  showPreloader: false,
  textAnswerRequest: "",
  successRequest: false,
  showSceletonPage: false,
  errServer: false,
  errServerUserMessage: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserAvatar(state, action) {
      state.user = { ...state.user, avatar: action.payload };
    },
    setSuccessRequest(state, action) {
      state.successRequest = action.payload;
    },
    addTextSuccess(state, action) {
      state.textAnswerRequest = action.payload;
    },
    killAllStateUser(state) {
      state.user = {};
      state.allMessagesAndAuthors = [];
      state.showPreloader = false;
      state.textAnswerRequest = "";
      state.successRequest = false;
      state.showSceletonPage = false;
      state.errServer = false;
      state.errServerUserMessage = false;
    },
  },
  extraReducers: (builder) => {
    // запрос на получение текущего пользователя
    builder.addCase(fetchGetUser.pending, (state) => {
      //console.log('запрос на получение пользователя');
      state.showSceletonPage = true;
    });
    builder.addCase(fetchGetUser.fulfilled, (state, { payload }) => {
      // console.log(payload);
      state.user = payload;
      state.admin = payload.admin;
      localStorage.setItem("userId", payload._id);
      localStorage.setItem("admin", payload.admin);
      state.showSceletonPage = false;
    });
    builder.addCase(fetchGetUser.rejected, (state, action) => {
      console.log("ошибка запроса на получение пользователя");
      state.showSceletonPage = false;
      state.errServer = true;
      console.log(action);
      state.textAnswerRequest = action.error.message;
    });
    // запрос на редактирование пользователя
    builder.addCase(fetchPatchUser.pending, (state) => {
      //console.log('запрос на редактирования пользователя');
      state.showPreloader = true;
    });
    builder.addCase(fetchPatchUser.fulfilled, (state, { payload }) => {
      state.user = payload;
      localStorage.setItem("userId", payload._id);
      state.showPreloader = false;
      state.textAnswerRequest = "изменения сохранены";
      state.successRequest = true;
    });
    builder.addCase(fetchPatchUser.rejected, (state, action) => {
      console.log("ошибка запроса на редактирование пользователя");
      console.log(action);
      state.showPreloader = false;
      state.textAnswerRequest = action.error.message;
    });

    // запрос на получение пользователя по id
    // builder.addCase(fetchGetUserId.pending, (state) => {
    //   console.log("запрос на получение пользователя по id");
    // });
    // builder.addCase(fetchGetUserId.fulfilled, (state, { payload }) => {});
    // builder.addCase(fetchGetUserId.rejected, (state) => {
    //   console.log("ошибка запроса получение пользователя по id");
    // });

    // запрос на получение пользователя по массиву id
    builder.addCase(fetchGetUserFindId.pending, (state) => {
      //console.log('запрос на получение пользователя по массиву id');
    });
    builder.addCase(fetchGetUserFindId.fulfilled, (state, { payload }) => {
      // console.log(payload);
      state.allMessagesAndAuthors = payload.topic.messages.map((messages) => {
        return {
          messages,
          user: payload.data.find((userInfo) => {
            if (userInfo) {
              return userInfo._id === messages.userId;
            }
            return null;
          }),
        };
      });
    });
    builder.addCase(fetchGetUserFindId.rejected, (state, action) => {
      console.log(action);
      console.log("ошибка запроса получение пользователя по массиву id");
      state.errServerUserMessage = true;
    });
  },
});

export const selectUser = (state) => state.user;

export const {
  killAllStateUser,
  addTextSuccess,
  setSuccessRequest,
  addUser,
  resetUserAvatar,
} = userSlice.actions;
export default userSlice.reducer;
