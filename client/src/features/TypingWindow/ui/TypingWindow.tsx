import { getMockedTypingText } from '../mockText'
import { CustomSpan } from './CustomSpan/CustomSpan'
import cls from './TypingWindow.module.scss'

export function TypingWindow() {
  return (
    <div className={cls.Container} tabIndex={0} onKeyUp={onKeyDownHandler} >
      {getMockedTypingText().map((el, index) => (
        <>  
          <CustomSpan key={index} isPointerOn={index === 15 || index === 16 }>
            {el === ' ' ? '\u00A0' : el}
          </CustomSpan>
        </>

      ))}
    </div>
  )
}

function onKeyDownHandler(){
  console.log('key pressed down')
}

