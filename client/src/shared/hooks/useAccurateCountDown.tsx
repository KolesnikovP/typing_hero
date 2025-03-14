import { useEffect, useState } from "react";

export default function useAccurateCountdown(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

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
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning]);

  const startCountdown = () => setIsRunning(true);
  const resetCountdown = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  };

  return { timeLeft, startCountdown, resetCountdown };
}
