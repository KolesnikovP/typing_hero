import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Timer.module.scss';

export const Timer = (props : {timeLeft: number}) => {
  const {timeLeft} = props;
  return (
    <div className={cls.Container}>
      <div className={cls.text}>
        Time Left: 
      </div>
      <span className={classNames(cls.time, {}, [cls.text])}>
        {timeLeft}s
      </span>
    </div>
  )
}
