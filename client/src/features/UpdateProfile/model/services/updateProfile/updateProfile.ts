import { createAsyncThunk } from '@reduxjs/toolkit';
import { User, userActions } from '@/entities/User';
import { USER_LOCALSTORAGE_KEY } from '@/shared/const/localstorage';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export interface UpdateProfileProps {
    username?: string;
    email?: string;
    name?: string;
    avatar?: string;
}

export const updateProfile = createAsyncThunk<
    User,
    UpdateProfileProps,
    ThunkConfig<string>
>(
    'user/updateProfile',
    async (profileData, thunkApi) => {
        const { extra, dispatch, rejectWithValue, getState } = thunkApi;

        try {
            const state = getState();
            const currentUser = state.user.authData;
            
            if (!currentUser) {
                return rejectWithValue('User not authenticated');
            }

            const response = await extra.api.put<User>(`/users/${currentUser.id}`, profileData);

            if (!response.data) {
                throw new Error();
            }

            const updatedUser = { ...currentUser, ...response.data };
            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(updatedUser));
            dispatch(userActions.setAuthData(updatedUser));
            return updatedUser;
        } catch (e) {
            console.log(e);
            return rejectWithValue('Failed to update profile');
        }
    },
);
