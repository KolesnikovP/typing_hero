import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Timer.module.scss';

type TimerFormat = 'seconds' | 'secondsWithMs';

interface TimerProps {
  timeLeft: number; // may include fractional seconds
  format?: TimerFormat;
}

export const Timer = (props: TimerProps) => {
  const { timeLeft, format = 'seconds' } = props;

  const safe = Math.max(timeLeft, 0);
  const display = format === 'seconds'
    ? Math.ceil(safe)
    : safe.toFixed(1);

  return (
    <div className={cls.Container}>
      <span className={classNames(cls.time, {}, [cls.text])}>
        {display}s
      </span>
    </div>
  )
}
