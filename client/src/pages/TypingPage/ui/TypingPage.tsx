import { Timer } from '@/features/Timer';
import { TypingWindow } from '@/features/TypingWindow'
import { getMockedTypingText } from '@/features/TypingWindow/mockText';
import useAccurateCountdown from '@/shared/hooks/useAccurateCountDown';
import { useEffect, useState } from 'react';
import { SessionStats } from './SessionStats/SessionStats';
import cls from './TypingPage.module.scss'

const initSessionProgress = {lettersTyped: 0, mistakesCount: 0} 
const mockedText = [...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText()]
const TIME_BY_DEFAULT = 5
export const TypingPage = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [sessionResults, setSessionResults] = useState(initSessionProgress)
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  const { timeLeft, startCountdown, resetCountdown } = useAccurateCountdown(TIME_BY_DEFAULT); // 10 seconds countdown
    // Function to start the session when user types first letter
  const handleFirstKeyPress = () => {
    if (!isSessionStarted) {
      setIsSessionStarted(true);
      startCountdown(); // Start the countdown
    }
  };

  const onSessionFinish = (chars: number, mistakes: number) => {
    setSessionResults(prev => ({...prev, lettersTyped: chars, mistakesCount: mistakes}))
    console.log('session is over', '>>>', chars, '  ', mistakes)
    setIsResultsVisible(true)
  }

  useEffect(() => {
    if(Number(timeLeft.toFixed(1)) === 0) {
      setIsSessionFinished(true);
      setIsSessionStarted(false);
    }
  }, [timeLeft])

  return (
    <div className={cls.TypingPage}>
      {
        isResultsVisible?
        <SessionStats
          lettersTyped={sessionResults.lettersTyped}
          mistakesCount={sessionResults.mistakesCount}
          givenTime={TIME_BY_DEFAULT}
        />
        :
        <div>
          <div>
            <Timer timeLeft={Number(timeLeft.toFixed(1))}/>
            <div>
              <button onClick={startCountdown}>Start</button>
              <button onClick={resetCountdown}>Reset</button>
            </div>
          </div>
          <TypingWindow
            canType={Number(timeLeft.toFixed(1)) > 0 && isSessionStarted}
            typingText={mockedText}
            onFirstKeyPress={handleFirstKeyPress}
            isSessionFinished={isSessionFinished}
            onSessionFinish={onSessionFinish}
          /> 
        </div>
       }
      <button onClick={() => {
        setIsSessionFinished(false);
        setIsResultsVisible(false);
        setIsSessionStarted(false);
        setSessionResults(initSessionProgress);
        resetCountdown();
      }}>
        AGAIN
      </button>
    </div>
  )
}
