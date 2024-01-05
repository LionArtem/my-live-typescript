import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: { paginationNumber: number } = {
  paginationNumber: 1,
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    pointNumberPagination(state, action: PayloadAction<number>) {
      state.paginationNumber = action.payload;
    },
    killPaginationState(state) {
      state.paginationNumber = 1;
    },
  },
});

export const selectPagination = (state: RootState) => state.pagination;

export const { pointNumberPagination, killPaginationState } =
  paginationSlice.actions;
export default paginationSlice.reducer;
