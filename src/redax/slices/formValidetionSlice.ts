import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type FormValidetionValue = {
  age?: number;
  email?: string;
  gender?: string;
  name?: string;
  password?: string;
  textarea?: string;
  topic?: string;
};

// type FormValidetionErr = {
//   age?: string;
//   email?: string;
//   gender?: string;
//   name?: string;
// };

interface ValueSet {
  value?: string;
  errors: String;
  valid?: boolean;
  name: string;
}

interface FormValidetion {
  value: FormValidetionValue;
  errors: FormValidetionValue;
  valid: boolean;
}

const initialState: FormValidetion = {
  value: {},
  errors: {},
  valid: false,
};

const formValidetionSlice = createSlice({
  name: 'formValidetion',
  initialState,
  reducers: {
    killAllStateFormValidetion(state) {
      state.value = {};
      state.errors = {};
      state.valid = false;
    },
    defaultValues(state, action: PayloadAction<FormValidetionValue>) {
      state.value = {
        name: action.payload.name,
        email: action.payload.email,
        age: action.payload.age,
        gender: action.payload.gender,
      };
    },
    setValue(state, action: PayloadAction<ValueSet>) {
      const { value, name, errors, valid } = action.payload;
      state.value = { ...state.value, [name]: value };
      state.errors = { ...state.errors, [name]: errors };
      state.valid = valid ? valid : false;
    },
    resetValues(state) {
      state.value = {};
    },
    setValid(state, action: PayloadAction<boolean>) {
      state.valid = action.payload;
    },
  },
});

export const selectformValidetion = (state: RootState) => state.formValidetion;

export const {
  setValue,
  resetValues,
  setValid,
  defaultValues,
  killAllStateFormValidetion,
} = formValidetionSlice.actions;
export default formValidetionSlice.reducer;
