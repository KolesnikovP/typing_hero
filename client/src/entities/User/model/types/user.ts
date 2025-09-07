import { UserRole } from '../consts/userConsts';

export interface User {
    id: string;
    username: string;
    email?: string;
    name?: string;
    avatar?: string;
    roles?: UserRole[];
}

export interface UserSchema {
    authData?: User;

    _inited: boolean;
}
