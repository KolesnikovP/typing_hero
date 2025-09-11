import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypingTextSchema } from '../types/typingTextSchema';
import { fetchText } from '../services/fetchText/fetchText';

const initialState: TypingTextSchema = {
  content: '',
  isLoading: false,
};

export const typingTextSlice = createSlice({
  name: 'typingText',
  initialState,
  reducers: {
    resetText: (state) => {
      state.content = '';
      state.id = undefined;
      state.options = undefined;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchText.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchText.fulfilled, (state, action) => {
        state.isLoading = false;
        state.id = action.payload.id;
        state.content = action.payload.content;
        state.options = action.payload.options;
      })
      .addCase(fetchText.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string | undefined;
      });
  },
});

export const { actions: typingTextActions } = typingTextSlice;
export const { reducer: typingTextReducer } = typingTextSlice;

