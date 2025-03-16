import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { CustomSpan } from './CustomSpan/CustomSpan'
import cls from './TypingWindow.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'

const filler = Array(200).fill(' ')
const ignoreKeysList: Set<string> = new Set(['Shift', 'Control', 'Meta', 'Alt', 'Tab', 'Esc'])
type TypingWindowProps = {
  canType?: boolean;
  typingText: string[];
  onFirstKeyPress: () => void;
} 
export function TypingWindow(props: TypingWindowProps) {
  const {canType, typingText, onFirstKeyPress} = props;
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [mistakenIndexes, setMistakenIndexes] = useState(new Set<number>());
  const [isFocusOnDiv, setIsFocusOnDiv] = useState(false);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null) // Ref for the scrolling containerRef
  const [isFirstKeyPressed, setIsFirstKeyPressed] = useState(false);
  /* set focus on the typing div when component mounted */
  useEffect(()=> {
    const container = containerRef.current;

    if(!container) return;

    setTimeout(() => container.focus(), 0);
  }, []);

 function onFocusHandler() {
    setIsFocusOnDiv(true);
  }

  function onBlurHandler() {
    setIsFocusOnDiv(false)
  }

  /* if the div lost focus let a user know by bluring it */
  const mods = {[cls.blured]: !isFocusOnDiv}

  function onKeyDownHandler(e: KeyboardEvent<HTMLDivElement>){
    if(!ignoreKeysList.has(e.key)) {
      // check it twice
      if (!isFirstKeyPressed) {
        setIsFirstKeyPressed(true);
        onFirstKeyPress(); // Notify the parent that typing has started
      }
      if(e.key !== typingText[currentLetterIndex]) {
        setMistakenIndexes(prev => new Set(prev).add(currentLetterIndex))
        // Scroll to the currently typed letter
        spanRefs.current[currentLetterIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: "start",
        })

        if(currentLetterIndex < typingText.length) {
          setCurrentLetterIndex(prev => prev + 1)
        }
      } else {
        if(currentLetterIndex < typingText.length) {
          setCurrentLetterIndex(prev => prev + 1)
        }
      }
    } 
  }

  return (
    <div className={cls.TypingWindow}>
      {!isFocusOnDiv && <div onClick={() => containerRef?.current?.focus()} className={cls.focusPopup}>Press here to return focus</div>}
      <div
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        ref={containerRef}
        className={classNames(cls.Container, mods, [])}
        tabIndex={0}
        onKeyDown={onKeyDownHandler}
      >
        {[...typingText, ...filler].map((el, index) => (
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
    </div>
  )
}
  /* sroll content inside of div */
  /*
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
*/
 
