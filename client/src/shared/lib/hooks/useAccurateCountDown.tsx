import { useEffect, useState } from "react";
type UseAccurateCountDownReturnType = {
  timeLeft: number,
  isRunning: boolean,
  startCountdown: () => void,
  resetCountdown: () => void,
}
export default function useAccurateCountdown(initialTime: number): UseAccurateCountDownReturnType {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  // Update timeLeft when initialTime changes (only when not running)
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(initialTime);
    }
  }, [initialTime, isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    let start = performance.now();
    let previousTimeLeft = timeLeft;
    let animationFrameId: number;

    const tick = () => {
      const elapsed = performance.now() - start;
      const newTimeLeft = Math.max(previousTimeLeft - elapsed / 1000, 0);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft > 0) {
        animationFrameId = requestAnimationFrame(tick);
      }

      // experement
      if (newTimeLeft === 0) {
        setIsRunning(false)
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning]);

  const startCountdown = () => setIsRunning(true);
  const resetCountdown = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  };

  return { timeLeft, startCountdown, resetCountdown, isRunning };
}
