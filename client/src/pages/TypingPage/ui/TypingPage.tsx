import { Timer } from '@/features/Timer';
import { TypingWindow } from '@/features/TypingWindow'
import { getMockedTypingText } from '@/features/TypingWindow/mockText';
import useAccurateCountdown from '@/shared/hooks/useAccurateCountDown';
import { useEffect, useState } from 'react';

const mockedText = [...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText(), ...getMockedTypingText()]
export const TypingPage = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const { timeLeft, startCountdown, resetCountdown, isRunning } = useAccurateCountdown(10); // 10 seconds countdown
    // Function to start the session when user types first letter
  const handleFirstKeyPress = () => {
    console.log('here§')
    if (!sessionStarted) {
      setSessionStarted(true);
      startCountdown(); // Start the countdown
    }
  };

  return (
    <div>
      <Timer timeLeft={timeLeft.toFixed(1)}/>
      <h2>Time Left: {timeLeft.toFixed(1)}s</h2>
      <button onClick={startCountdown}>Start</button>
      <button onClick={resetCountdown}>Reset</button>
     <TypingWindow canType={isRunning} typingText={mockedText} onFirstKeyPress={handleFirstKeyPress}/> 
    </div>
  )
}
