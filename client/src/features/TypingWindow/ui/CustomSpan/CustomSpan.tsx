import { forwardRef, HTMLAttributes } from 'react'
import cls from './CustomSpan.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'

type CustomSpanProps = HTMLAttributes<HTMLSpanElement> & {
 isPointerOn: boolean, 
  isTyped: boolean,
  isMistakenKey: boolean,
  isCorrectedMistake?: boolean,
}

export const CustomSpan = forwardRef<HTMLSpanElement, CustomSpanProps>((props, ref) => {
  const {children, isPointerOn, isTyped, isMistakenKey = false, isCorrectedMistake = false, ...restProps} = props
  let mods = {
    [cls.ActivePointer]: isPointerOn,
    [cls.TypedLetter]: isTyped,
    [cls.MistakenLetter]: isMistakenKey,
    [cls.CorrectedMistake]: isCorrectedMistake,
  }
  return (
    <span ref={ref} className={classNames(cls.Container, mods, [])} {...restProps}>
     {children} 
    </span>
  )
})
