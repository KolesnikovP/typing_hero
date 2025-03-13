import { KeyboardEvent, useState } from 'react'
import { getMockedTypingText } from '../mockText'
import { CustomSpan } from './CustomSpan/CustomSpan'
import cls from './TypingWindow.module.scss'

const mockedText = getMockedTypingText()
const ignoreKeysList: Set<string> = new Set(['Shift', 'Control', 'Meta', 'Alt', 'Tab'])
export function TypingWindow() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  function onKeyDownHandler(e: KeyboardEvent<HTMLDivElement>){
    if(!ignoreKeysList.has(e.key)) {
      setCurrentLetterIndex(prev => prev + 1)
    } 

    console.log('key pressed down>>>> ', e.key)
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

