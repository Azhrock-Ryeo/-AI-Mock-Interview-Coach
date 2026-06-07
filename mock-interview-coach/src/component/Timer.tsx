import useTimer from "../hooks/useTimer";

interface TimerProps {
  duration: number;
  onExpire?: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const Timer = ({ duration, onExpire }: TimerProps) => {
  const { timeLeft, isExpired } = useTimer({ duration, onExpire });

  const getColorClass = () => {
    if (timeLeft <= 10) return "text-red-500";
    if (timeLeft <= 30) return "text-yellow-500";
    return "text-gray-800";
  };

  const isCritical = timeLeft <= 10 && !isExpired;

  return (
    <div className={`text-3xl font-bold tabular-nums ${getColorClass()} ${isCritical ? "animate-pulse" : ""}`}>
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;