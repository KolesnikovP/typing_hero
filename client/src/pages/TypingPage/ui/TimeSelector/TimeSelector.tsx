import { HTMLAttributes } from 'react';
import cls from './TimeSelector.module.scss';

const TIME_INTERVALS = [15, 30, 45, 60] as const;
export type TimeInterval = typeof TIME_INTERVALS[number];

// Storage is managed at the page level via useLocalStorage; this component is controlled-only.

type TimeSelectorProps = HTMLAttributes<HTMLDivElement> & {
  selectedTime: TimeInterval;
  onTimeChange: (time: TimeInterval) => void;
  disabled?: boolean;
  hideLabel?: boolean;
}

export const TimeSelector = (props: TimeSelectorProps) => {
  const { selectedTime, onTimeChange, disabled = false, hideLabel = false, className, ...otherProps } = props;

  const handleTimeChange = (time: TimeInterval) => {
    if (!disabled) {
      onTimeChange(time);
    }
  };

  return (
    <div className={`${cls.TimeSelector} ${className || ''}`} {...otherProps}>
      {!hideLabel && (
        <div className={cls.TimeSelectorLabel}>Session Duration:</div>
      )}
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
