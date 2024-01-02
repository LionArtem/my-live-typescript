import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paginationNumber: 1,
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    pointNumberPagination(state, action) {
      state.paginationNumber = action.payload;
    },
    killPaginationState(state) {
      state.paginationNumber = 1;
    },
  },
});

export const selectPagination = (state) => state.pagination;

export const { pointNumberPagination, killPaginationState } =
  paginationSlice.actions;
export default paginationSlice.reducer;
