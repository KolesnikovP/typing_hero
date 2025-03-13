import { KeyboardEvent, useRef, useState } from 'react'
import { getMockedTypingText } from '../mockText'
import { CustomSpan } from './CustomSpan/CustomSpan'
import cls from './TypingWindow.module.scss'

const mockedText = [...getMockedTypingText(), ...getMockedTypingText()]
const ignoreKeysList: Set<string> = new Set(['Shift', 'Control', 'Meta', 'Alt', 'Tab'])

export function TypingWindow() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [mistakenIndexes, setMistakenIndexes] = useState(new Set<number>());
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null) // Ref for the scrolling containerRef

  function onKeyDownHandler(e: KeyboardEvent<HTMLDivElement>){
    if(!ignoreKeysList.has(e.key)) {
      if(e.key !== mockedText[currentLetterIndex]) {
        setMistakenIndexes(prev => new Set(prev).add(currentLetterIndex))
        // Scroll to the currently typed letter
        spanRefs.current[currentLetterIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: "start",
        })

      } else {
        setCurrentLetterIndex(prev => prev + 1)
      }
    } 
  }

  return (
    <div
      ref={containerRef}
      className={cls.Container}
      tabIndex={0}
      onKeyDown={onKeyDownHandler}
    >
      {mockedText.map((el, index) => (
          <CustomSpan
            key={index}
            ref={(el) => (spanRefs.current[index] = el)} // Assign ref
            isPointerOn={index === currentLetterIndex }
            isTyped={currentLetterIndex <= index}
            isMistakenKey={mistakenIndexes.has(index)} // Check if this index was mistaken
          >
            {el === ' ' ? '\u00A0' : el}
          </CustomSpan>
      ))}
    </div>
  )
}

