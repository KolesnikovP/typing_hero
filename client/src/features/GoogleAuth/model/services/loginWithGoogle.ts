import { createAsyncThunk } from '@reduxjs/toolkit';
import { User, userActions } from '@/entities/User';
import { USER_LOCALSTORAGE_KEY } from '@/shared/const/localstorage';
import { ThunkConfig } from '@/app/providers/StoreProvider';

interface LoginWithGoogleProps {
    idToken: string;
}

export const loginWithGoogle = createAsyncThunk<
    User,
    LoginWithGoogleProps,
    ThunkConfig<string>
>(
    'auth/loginWithGoogle',
    async (authData, thunkApi) => {
        const { extra, dispatch, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.post<User>('/auth/google', { token: authData.idToken });

            if (!response.data) {
                throw new Error();
            }

            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(response.data));
            dispatch(userActions.setAuthData(response.data));
            return response.data;
        } catch (err: any) {
            const msg = err?.response?.data || err?.message || 'error';
            return rejectWithValue(typeof msg === 'string' ? msg : 'error');
        }
    },
);
