import { HTMLAttributes } from 'react';
import cls from './TimeSelector.module.scss';

const TIME_INTERVALS = [15, 30, 45, 60] as const;
export type TimeInterval = typeof TIME_INTERVALS[number];

const STORAGE_KEY = 'typing_hero_selected_time';
const DEFAULT_TIME = 60;

export const getStoredTime = (): TimeInterval => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && TIME_INTERVALS.includes(Number(stored) as TimeInterval)) {
      return Number(stored) as TimeInterval;
    }
  } catch (e) {
    // localStorage not available or error
  }
  return DEFAULT_TIME;
};

const saveSelectedTime = (time: TimeInterval): void => {
  try {
    localStorage.setItem(STORAGE_KEY, time.toString());
  } catch (e) {
    // localStorage not available
  }
};

type TimeSelectorProps = HTMLAttributes<HTMLDivElement> & {
  selectedTime: TimeInterval;
  onTimeChange: (time: TimeInterval) => void;
  disabled?: boolean;
}

export const TimeSelector = (props: TimeSelectorProps) => {
  const { selectedTime, onTimeChange, disabled = false, className, ...otherProps } = props;

  const handleTimeChange = (time: TimeInterval) => {
    if (!disabled) {
      onTimeChange(time);
      saveSelectedTime(time);
    }
  };

  return (
    <div className={`${cls.TimeSelector} ${className || ''}`} {...otherProps}>
      <div className={cls.TimeSelectorLabel}>Session Duration:</div>
      <div className={cls.TimeButtons}>
        {TIME_INTERVALS.map((time) => (
          <button
            key={time}
            className={`${cls.TimeButton} ${selectedTime === time ? cls.TimeButtonActive : ''}`}
            onClick={() => handleTimeChange(time)}
            disabled={disabled}
          >
            {time}s
          </button>
        ))}
      </div>
    </div>
  );
};
