
import  {
    InputHTMLAttributes, memo, useEffect, useRef, useState,
} from 'react';
import { classNames, Mods } from '@/shared/lib/classNames/classNames';
import cls from './Input.module.scss';
import { Description, Field, Input as HeadlessInput, Label } from '@headlessui/react';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'readOnly'>

interface InputProps extends HTMLInputProps {
    className?: string;
    value?: string | number;
    onChange?: (value: string) => void;
    autofocus?: boolean;
    readonly?: boolean;
    label?: string;
    description?: string;
}

export const Input = memo((props: InputProps) => {
    const {
        className,
        value,
        onChange,
        type = 'text',
        autofocus,
        readonly,
        label,
        description,
        ...otherProps
    } = props;
    const ref = useRef<HTMLInputElement>(null);
    const mods: Mods = {
        [cls.readonly]: readonly,
    };
    const [_, setIsFocused] = useState(false);

    useEffect(() => {
        if (autofocus) {
            setIsFocused(true);
            ref.current?.focus();
        }
    }, [autofocus]);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    const onBlur = () => {
        setIsFocused(false);
    };

    const onFocus = () => {
        setIsFocused(true);
    };

  return (
    <Field>
      {label &&
      <Label className={cls.label}>
        {label} 
      </Label>
      }
      {description &&
        <Description className={cls.description}>
          Use your real name so people will recognize you
        </Description>
      }
      <HeadlessInput
        ref={ref}
        type={type}
        value={value}
        name="full_name"
        onChange={onChangeHandler}
        onBlur={onBlur}
        onFocus={onFocus}
        className={classNames(cls.input, mods, [])}
        {...otherProps}
      />
    </Field>
  );
});
