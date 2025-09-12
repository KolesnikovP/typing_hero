import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Text } from '@/shared/ui/Text';
import { GoogleLogin } from '@react-oauth/google';
import { getLoginUsername, getLoginPassword, getLoginIsLoading, getLoginError, loginActions, loginByUsername } from '@/features/AuthByIdentifier';
import { loginWithGoogle } from '@/features/GoogleAuth';
import { Link, useNavigate } from 'react-router';
import { getRouteSignup, getRouteTyping } from '@/shared/const/router';
import { Card } from '@/shared/ui/Card';
import cls from './AuthLoginView.module.scss';

export const AuthLoginView = () => {
  const dispatch = useAppDispatch();
  const username = useSelector(getLoginUsername);
  const password = useSelector(getLoginPassword);
  const isLoading = useSelector(getLoginIsLoading);
  const error = useSelector(getLoginError);

  const onChangeUsername = useCallback((value: string) => {
    dispatch(loginActions.setUsername(value));
    dispatch(loginActions.clearError());
  }, [dispatch]);

  const onChangePassword = useCallback((value: string) => {
    dispatch(loginActions.setPassword(value));
    dispatch(loginActions.clearError());
  }, [dispatch]);

  const navigate = useNavigate();

  const onLoginClick = useCallback(async () => {
    const result = await dispatch(loginByUsername({ username, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(getRouteTyping());
    }
  }, [dispatch, navigate, username, password]);

  const onGoogleLoginSuccess = useCallback(async (credentialResponse: any) => {
    const result = await dispatch(loginWithGoogle({ idToken: credentialResponse.credential } as any));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(getRouteTyping());
    }
  }, [dispatch, navigate]);

  const onGoogleLoginError = useCallback(() => {
    console.log('Google Login Failed');
  }, []);

  return (
    <div className={cls.Container}>
      <Card className={cls.Box}>
        <Text title={'Sign in'} />
        {error && <Text text={error} theme={'error'} />}
        <Input autofocus type="text" placeholder={'Email or username'} onChange={onChangeUsername} value={username} />
        <Input type="text" placeholder={'Enter password'} onChange={onChangePassword} value={password} />
        <Button theme={'primary'} onClick={onLoginClick} disabled={isLoading}>Sign in</Button>
        <div className={cls.GoogleRow}>
          <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginError} />
        </div>
        <div className={cls.FooterRow}>
          <Link to={getRouteSignup()} className={cls.Link}>Create account</Link>
        </div>
      </Card>
    </div>
  );
};
