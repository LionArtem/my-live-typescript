import { configureStore } from "@reduxjs/toolkit";
import topics from "./slices/topicSlice";
import auth from "./slices/authSlice";
import user from "./slices/userSlice";
import formValidetion from "./slices/formValidetionSlice";
import pagination from "./slices/paginationSlice";
import moduleConfirmation from "./slices/moduleConfirmationSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    topics,
    auth,
    user,
    formValidetion,
    pagination,
    moduleConfirmation,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
