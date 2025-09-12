import { memo, useCallback, useState } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Text } from '@/shared/ui/Text';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { register } from '@/features/Register';
import { Link, useNavigate } from 'react-router';
import { getRouteLogin, getRouteTyping } from '@/shared/const/router';
import { Card } from '@/shared/ui/Card';
import cls from './SignupPage.module.scss';

interface SignupPageProps {
  className?: string;
}

export const SignupPage = memo(({ className }: SignupPageProps) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const onChangeEmail = useCallback((value: string) => {
    setEmail(value);
    setError(undefined);
  }, []);
  const onChangePassword = useCallback((value: string) => {
    setPassword(value);
    setError(undefined);
  }, []);

  const navigate = useNavigate();
  const onSignupClick = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    const result = await dispatch(register({ email, password }));
    setIsLoading(false);
    if (result.meta.requestStatus === 'rejected') {
      setError(result.payload as string);
    } else {
      navigate(getRouteTyping());
    }
  }, [dispatch, email, password, navigate]);

  return (
    <div className={classNames(cls.Container, {}, [className])}>
      <Card className={cls.Box}>
        <Text title={'Create account'} />
        {error && <Text text={error} theme={'error'} />}
        <Input type="text" placeholder={'Enter email'} onChange={onChangeEmail} value={email} />
        <Input type="text" placeholder={'Choose a password'} onChange={onChangePassword} value={password} />
        <Button theme={'primary'} onClick={onSignupClick} disabled={isLoading}>Create account</Button>
        <div className={cls.FooterRow}>
          <Link to={getRouteLogin()} className={cls.Link}>Sign in</Link>
        </div>
      </Card>
    </div>
  );
});
