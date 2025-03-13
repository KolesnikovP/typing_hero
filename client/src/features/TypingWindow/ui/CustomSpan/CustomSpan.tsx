import { FC, HTMLAttributes } from 'react'
import cls from './CustomSpan.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'

type CustomSpanProps = HTMLAttributes<HTMLSpanElement> & {
 isPointerOn: boolean, 
  isTyped: boolean
}

export const CustomSpan: FC<CustomSpanProps> = (props) => {
  const {children, isPointerOn, isTyped, ...restProps} = props
  let mods = {
    [cls.ActivePointer]: isPointerOn,
    [cls.TypedLetter]: isTyped,
  }
  return (
    <span className={classNames(cls.Container, mods, [])} {...restProps}>
     {children} 
    </span>
  )
}
