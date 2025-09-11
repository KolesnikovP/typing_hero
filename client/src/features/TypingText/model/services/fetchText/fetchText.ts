import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export interface FetchTextOptions {
  length?: number;
  punctuation?: boolean;
  numbers?: boolean;
}

export interface TextResponseDto {
  id: string;
  content: string;
  options: {
    length: number;
    punctuation: boolean;
    numbers: boolean;
  };
  source: string;
  language: string;
}

export const fetchText = createAsyncThunk<
  TextResponseDto,
  FetchTextOptions | void,
  ThunkConfig<string>
>(
  'texts/fetchText',
  async (opts, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;
    try {
      const params = new URLSearchParams();
      if (opts?.length) params.set('length', String(opts.length));
      if (typeof opts?.punctuation === 'boolean') params.set('punctuation', String(opts.punctuation));
      if (typeof opts?.numbers === 'boolean') params.set('numbers', String(opts.numbers));
      const qs = params.toString();
      const url = `/texts${qs ? `?${qs}` : ''}`;
      const response = await extra.api.get<TextResponseDto>(url);
      if (!response.data) {
        throw new Error('No data');
      }
      return response.data;
    } catch (e) {
      console.log(e);
      return rejectWithValue('Failed to fetch text');
    }
  },
);

