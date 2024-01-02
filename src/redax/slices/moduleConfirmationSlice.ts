import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  statusModule: false,
};

const moduleConfirmationSlice = createSlice({
  name: 'moduleConfirmation',
  initialState,
  reducers: {
    isStatusModule(state, { payload }) {
      state.statusModule = payload;
    },
  },
});

export const selectModuleConfirmation = (state) => state.moduleConfirmation;

export const { isStatusModule } = moduleConfirmationSlice.actions;
export default moduleConfirmationSlice.reducer;
