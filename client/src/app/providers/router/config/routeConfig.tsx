import { TypingPage } from '@/pages/TypingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import {
    AppRoutes,
    getRouteTyping,
    getRouteProfile,
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
    // last
    [AppRoutes.NOT_FOUND]: {
        path: '*',
        // element: <NotFoundPage />,
        element: <div>not found page</div>
    },
};
