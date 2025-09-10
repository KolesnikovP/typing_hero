import { HTMLAttributes } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Card.module.scss';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  compact?: boolean;
}

export const Card = (props: CardProps) => {
  const { className, compact = false, children, ...other } = props;

  return (
    <div className={classNames(cls.Card, { [cls.compact]: compact }, [className])} {...other}>
      {children}
    </div>
  );
}

