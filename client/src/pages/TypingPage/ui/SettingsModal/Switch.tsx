import cls from './Switch.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';

type SwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  id?: string;
}

export const Switch = ({ checked, onChange, id }: SwitchProps) => {
  return (
    <label className={classNames(cls.Switch, { [cls.Checked]: checked }, [])} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={cls.Input}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={cls.Track}>
        <span className={cls.Thumb} />
      </span>
    </label>
  );
}

