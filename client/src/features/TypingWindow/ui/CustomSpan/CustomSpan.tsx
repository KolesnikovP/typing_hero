import { FC, HTMLAttributes } from 'react'
import cls from './CustomSpan.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'

type CustomSpanProps = HTMLAttributes<HTMLSpanElement> & {
 isPointerOn: boolean, 
  isTyped: boolean,
  isMistakenKey: boolean,
  isCorrectedMistake?: boolean,
}

export const CustomSpan: FC<CustomSpanProps> = (props) => {
  const {children, isPointerOn, isTyped, isMistakenKey = false, isCorrectedMistake = false, ...restProps} = props
  let mods = {
    [cls.ActivePointer]: isPointerOn,
    [cls.TypedLetter]: isTyped,
    [cls.MistakenLetter]: isMistakenKey,
    [cls.CorrectedMistake]: isCorrectedMistake,
  }
  return (
    <span className={classNames(cls.Container, mods, [])} {...restProps}>
     {children} 
    </span>
  )
}
