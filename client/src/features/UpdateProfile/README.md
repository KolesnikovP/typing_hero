# UpdateProfile Feature

This feature handles updating user profile information.

## Services

### `updateProfile`
Async thunk service for updating user profile data through the API.

**Parameters:**
- `username?`: Optional username update
- `email?`: Optional email update  
- `name?`: Optional name update
- `avatar?`: Optional avatar URL update

**Returns:**
- Updated User object on success
- Error message on failure

**Side Effects:**
- Updates localStorage with new user data
- Updates Redux user state via userActions.setAuthData
- Sends PUT request to `/users/{id}` endpoint

## Usage

```typescript
import { updateProfile } from '@/features/UpdateProfile';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';

const dispatch = useAppDispatch();

const handleUpdateProfile = async () => {
  try {
    await dispatch(updateProfile({
      username: 'newUsername',
      name: 'New Name'
    })).unwrap();
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};
```
