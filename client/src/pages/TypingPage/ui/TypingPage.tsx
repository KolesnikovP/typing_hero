import { TypingWindow } from '@/features/TypingWindow'
import useAccurateCountdown from '@/shared/hooks/useAccurateCountDown';
import { useEffect } from 'react';

export const TypingPage = () => {
  const { timeLeft, startCountdown, resetCountdown, isRunning } = useAccurateCountdown(10); // 10 seconds countdown
  useEffect(() => {console.log(isRunning, 'is running here')}, [isRunning])
  return (
    <div>
      <h2>Time Left: {timeLeft.toFixed(1)}s</h2>
      <button onClick={startCountdown}>Start</button>
      <button onClick={resetCountdown}>Reset</button>
     <TypingWindow canType={isRunning}/> 
    </div>
  )
}
