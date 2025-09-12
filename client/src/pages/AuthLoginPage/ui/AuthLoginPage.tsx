import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { loginReducer } from '@/features/AuthByIdentifier';
import { AuthLoginView } from './AuthLoginView';

interface AuthLoginPageProps {
  className?: string;
}

const reducers: ReducersList = {
  loginForm: loginReducer,
};

export const AuthLoginPage = memo(({ className }: AuthLoginPageProps) => {
  return (
    <DynamicModuleLoader removeAfterUnmount reducers={reducers}>
      <div className={classNames('', {}, [className])}>
        <AuthLoginView />
      </div>
    </DynamicModuleLoader>
  );
});

