import { Timer } from '@/features/Timer';
import { TypingWindow } from '@/features/TypingWindow'
import { getMockedTypingText } from '@/features/TypingWindow/mockText';
import useAccurateCountdown from '@/shared/hooks/useAccurateCountDown';
import { useEffect, useState } from 'react';
import { SessionStats } from './SessionStats/SessionStats';

const initSessionProgress = {lettersTyped: 0, mistakesCount: 0} 
const mockedText = [...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText()]
export const TypingPage = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(initSessionProgress)
  const { timeLeft, startCountdown, resetCountdown } = useAccurateCountdown(5); // 10 seconds countdown
    // Function to start the session when user types first letter
  const handleFirstKeyPress = () => {
    if (!sessionStarted) {
      setSessionStarted(true);
      startCountdown(); // Start the countdown
    }
  };

  const onSessionFinish = () => {
    console.log('session is over')
  }

  useEffect(() => {
    if(Number(timeLeft.toFixed(1)) === 0) {
      onSessionFinish();
      setSessionFinished(true);
      setSessionStarted(false);
    }
  }, [timeLeft])

  return (
    <div>
      <Timer timeLeft={Number(timeLeft.toFixed(1))}/>
      <h2>Time Left: {timeLeft.toFixed(1)}s</h2>
      <button onClick={startCountdown}>Start</button>
      <button onClick={resetCountdown}>Reset</button>

          <SessionStats
            lettersTyped={sessionProgress.lettersTyped}
            mistakesCount={sessionProgress.mistakesCount}
          />
          <TypingWindow
            canType={Number(timeLeft.toFixed(1)) > 0 && sessionStarted}
            typingText={mockedText}
            onFirstKeyPress={handleFirstKeyPress}
            isSessionFinished={sessionFinished}
            onSessionFinish={onSessionFinish}
          /> 

      <button onClick={() => {
        setSessionFinished(false)
        resetCountdown()
      }}>
        AGAIN
      </button>
    </div>
  )
}
