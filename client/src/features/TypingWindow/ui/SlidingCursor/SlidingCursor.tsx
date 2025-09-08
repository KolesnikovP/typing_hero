import { FC } from 'react'
import cls from './SlidingCursor.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'

interface SlidingCursorProps {
  position: {
    left: number;
    top: number;
  };
  isSessionStarted?: boolean;
  className?: string;
}

export const SlidingCursor: FC<SlidingCursorProps> = (props) => {
  const { position, isSessionStarted = false, className } = props;

  const mods = {
    [cls.pulsing]: !isSessionStarted,
  };

  return (
    <div
      className={classNames(cls.slidingCursor, mods, [className])}
      style={{
        left: position.left,
        top: position.top,
      }}
    />
  );
};
