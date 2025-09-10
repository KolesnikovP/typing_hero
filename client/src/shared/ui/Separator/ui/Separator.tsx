import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Separator.module.scss';

type SeparatorProps = { className?: string };

export const Separator = ({ className }: SeparatorProps = {}) => {
  return <div className={classNames(cls.separator, {}, [className])} />;
};
