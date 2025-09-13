import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypingTextSchema, TypingTextOptions, TypingText } from '../types/typingTextSchema';
import { fetchText } from '../services/fetchText/fetchText';

const initialState: TypingTextSchema = {
  content: '',
  isLoading: false,
  error: undefined,
  byId: {},
};

export const typingTextSlice = createSlice({
  name: 'typingText',
  initialState,
  reducers: {
    resetCurrentTypingText: (state) => {
      state.id = undefined;
      state.content = '';
      state.options = undefined;
      state.error = undefined;
      state.isLoading = false;
    },
    setCurrentTypingTextById: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const cache = state.byId || {};
      const found = cache[id];
      if (found) {
        state.id = found.id;
        state.content = found.content;
        state.options = found.options;
        // We intentionally do not modify isLoading/error here
      }
    },
    setTypingTextOptions: (state, action: PayloadAction<Partial<TypingTextOptions>>) => {
      if (state.options) {
        state.options = { ...state.options, ...action.payload };
      } else {
        // Establish options if they don't exist yet
        state.options = action.payload as TypingTextOptions;
      }
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
        const payload = action.payload;
        state.id = payload.id;
        state.content = payload.content;
        state.options = payload.options;
        // Cache full entity for potential later switching by id
        const full: TypingText = {
          id: payload.id,
          content: payload.content,
          options: payload.options,
          source: payload.source,
          language: payload.language,
        };
        if (!state.byId) state.byId = {};
        state.byId[payload.id] = full;
      })
      .addCase(fetchText.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string | undefined;
      });
  },
});

export const { actions: typingTextActions } = typingTextSlice;
export const { reducer: typingTextReducer } = typingTextSlice;

