import { FC, HTMLAttributes } from 'react'
import cls from './CustomSpan.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'

type CustomSpanProps = HTMLAttributes<HTMLSpanElement> & {
 isPointerOn: boolean 
}

export const CustomSpan: FC<CustomSpanProps> = (props) => {
  const {children, isPointerOn, ...restProps} = props
  let mods = {
    [cls.ActivePointer]: isPointerOn,
  }
  return (
    <span className={classNames(cls.Container, mods, [])} {...restProps}>
     {children} 
    </span>
  )
}
