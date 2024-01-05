import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: { statusModule: boolean } = {
  statusModule: false,
};

const moduleConfirmationSlice = createSlice({
  name: 'moduleConfirmation',
  initialState,
  reducers: {
    isStatusModule(state, action: PayloadAction<boolean>) {
      state.statusModule = action.payload;
    },
  },
});

export const selectModuleConfirmation = (state: RootState) =>
  state.moduleConfirmation;

export const { isStatusModule } = moduleConfirmationSlice.actions;
export default moduleConfirmationSlice.reducer;
