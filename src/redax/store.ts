import { configureStore } from '@reduxjs/toolkit';
import topics from './slices/topicSlice';
import auth from './slices/authSlice';
import user from './slices/userSlice';
import formValidetion from './slices/formValidetionSlice';
import pagination from './slices/paginationSlice';
import moduleConfirmation from './slices/moduleConfirmationSlice';

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
