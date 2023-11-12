import {createSlice} from '@reduxjs/toolkit';

// Types
type User = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  name: string;
  email: string;
};

type InitialState = {
  error: string | null | undefined;
  data: User;
  newUser: User;
};

// Initial State
const initialState: InitialState = {
  error: null,
  data: {
    status: 'idle',
    name: '',
    email: '',
  },
  newUser: {
    status: 'idle',
    name: '',
    email: '',
  },
};

// Slice
const dummyNetwokSlice = createSlice({
  name: 'dummyNetworkSlice',
  initialState,
  reducers: {},
  extraReducers() {},
});

export const {} = dummyNetwokSlice.actions;

export default dummyNetwokSlice.reducer;
