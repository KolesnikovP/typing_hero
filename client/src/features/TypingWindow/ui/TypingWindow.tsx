import { FocusEventHandler, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { getMockedTypingText } from '../mockText'
import { CustomSpan } from './CustomSpan/CustomSpan'
import cls from './TypingWindow.module.scss'

const mockedText = [...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText()]
const filler = Array(200).fill(' ')
const ignoreKeysList: Set<string> = new Set(['Shift', 'Control', 'Meta', 'Alt', 'Tab'])

export function TypingWindow() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [mistakenIndexes, setMistakenIndexes] = useState(new Set<number>());
  const [isFocusOnDiv, setIsFocusOnDiv] = useState(false);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null) // Ref for the scrolling containerRef

  useEffect(()=> {
    containerRef?.current?.focus()

    console.log(containerRef?.current === document.activeElement, 'focus effect')
  }, []);

  useEffect(() => {
    if (containerRef.current && spanRefs.current[currentLetterIndex]) {
      const container = containerRef.current
      const currentSpan = spanRefs.current[currentLetterIndex]

      if (currentSpan) {
        const spanBottom = currentSpan.offsetTop + currentSpan.clientHeight
        const containerBottom = container.scrollTop + container.clientHeight

        // Scroll only if the current letter is beyond the visible container
        if (spanBottom > containerBottom) {
          container.scrollTop = spanBottom - container.clientHeight
        }
      }
    }
  }, [currentLetterIndex])

  function onFocusHandler(e: FocusEventHandler<HTMLDivElement>) {
    console.log(e.name, 'on focus handler')
  }

  function onKeyDownHandler(e: KeyboardEvent<HTMLDivElement>){
    // console.log(containerRef.current?.clientHeight)
    // const currentSpan = spanRefs.current[currentLetterIndex]?.offsetTop
    // console.log('span >>> ', currentSpan, currentLetterIndex)
    if(!ignoreKeysList.has(e.key)) {
      if(e.key !== mockedText[currentLetterIndex]) {
        setMistakenIndexes(prev => new Set(prev).add(currentLetterIndex))
        // Scroll to the currently typed letter
        // spanRefs.current[currentLetterIndex]?.scrollIntoView({
          // behavior: 'smooth',
          // block: 'center',
          // inline: "start",
        // })

        if(currentLetterIndex < mockedText.length) {
          setCurrentLetterIndex(prev => prev + 1)
        }
      } else {
        if(currentLetterIndex < mockedText.length) {
          setCurrentLetterIndex(prev => prev + 1)
        }
      }
    } 
  }

  return (
    <div
      onFocus={onFocusHandler}
      ref={containerRef}
      className={cls.Container}
      tabIndex={0}
      onKeyDown={onKeyDownHandler}
    >
      {[...mockedText, ...filler].map((el, index) => (
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

