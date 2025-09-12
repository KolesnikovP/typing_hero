import { createAsyncThunk } from '@reduxjs/toolkit';
import { User, userActions } from '@/entities/User';
import { USER_LOCALSTORAGE_KEY } from '@/shared/const/localstorage';
import { ThunkConfig } from '@/app/providers/StoreProvider';

interface RegisterProps {
    email: string;
    password: string;
    username?: string;
    name?: string;
}

export const register = createAsyncThunk<
    User,
    RegisterProps,
    ThunkConfig<string>
>(
    'auth/register',
    async (data, thunkApi) => {
        const { extra, dispatch, rejectWithValue } = thunkApi;
        try {
            const response = await extra.api.post<User>('/register', data);
            if (!response.data) {
                throw new Error();
            }
            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(response.data));
            dispatch(userActions.setAuthData(response.data));
            return response.data;
        } catch (err: any) {
            const status = err?.response?.status as number | undefined;
            let msg: string = err?.response?.data || err?.message || 'Registration failed';
            if (status === 409) {
                const normalizedMessage = String(msg).toLowerCase();
                if (normalizedMessage.includes('email')) {
                    msg = 'This email is already registered. Please sign in.';
                } else if (normalizedMessage.includes('username')) {
                    msg = 'This username is already taken.';
                }
            }
            return rejectWithValue(typeof msg === 'string' ? msg : 'Registration failed');
        }
    },
);
