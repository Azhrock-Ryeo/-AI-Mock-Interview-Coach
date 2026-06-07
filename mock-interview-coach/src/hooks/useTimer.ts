import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerProps {
  duration: number;
  onExpire?: () => void;
}

interface UseTimerResult {
  timeLeft: number;
  isExpired: boolean;
}

const useTimer = ({ duration, onExpire }: UseTimerProps): UseTimerResult => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    setTimeLeft(duration);
    setIsExpired(false);
    clearTimer();

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsExpired(true);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [duration, onExpire, clearTimer]);

  return { timeLeft, isExpired };
};

export default useTimer;