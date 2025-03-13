import { KeyboardEvent, useState } from 'react'
import { getMockedTypingText } from '../mockText'
import { CustomSpan } from './CustomSpan/CustomSpan'
import cls from './TypingWindow.module.scss'

const mockedText = getMockedTypingText()

export function TypingWindow() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  function onKeyDownHandler(e: KeyboardEvent<HTMLDivElement>){
    
    console.log('key pressed down>>>> ', e.key)
    setCurrentLetterIndex(prev => prev + 1)
  }
  return (
    <div className={cls.Container} tabIndex={0} onKeyDown={onKeyDownHandler} >
      {mockedText.map((el, index) => (
        <>  
          <CustomSpan
            key={index}
            isPointerOn={index === currentLetterIndex }
            isTyped={currentLetterIndex <= index}
          >
            {el === ' ' ? '\u00A0' : el}
          </CustomSpan>
        </>
      ))}
    </div>
  )
}


