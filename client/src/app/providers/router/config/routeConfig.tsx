import { TypingPage } from '@/pages/TypingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AuthLoginPage } from '@/pages/AuthLoginPage';
import { SignupPage } from '@/pages/SignupPage';
import {
    AppRoutes,
    getRouteTyping,
    getRouteProfile,
    getRouteForbidden,
    getRouteLogin,
    getRouteSignup,
} from '@/shared/const/router';

import { AppRoutesProps } from '@/shared/types/router';

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.TYPING]: {
        path: getRouteTyping(),
        element: <TypingPage />,
    },
    [AppRoutes.PROFILE]: {
        path: getRouteProfile(),
        element: <ProfilePage />,
        authOnly: true,
    },
    [AppRoutes.FORBIDDEN]: {
        path: getRouteForbidden(),
        element: <ProfilePage />,
        authOnly: true,
    },
    [AppRoutes.LOGIN]: {
        path: getRouteLogin(),
        element: <AuthLoginPage />,
    },
    [AppRoutes.SIGNUP]: {
        path: getRouteSignup(),
        element: <SignupPage />,
    },
    // last
    [AppRoutes.NOT_FOUND]: {
        path: '*',
        // element: <NotFoundPage />,
        element: <div>not found page</div>
    },
};
