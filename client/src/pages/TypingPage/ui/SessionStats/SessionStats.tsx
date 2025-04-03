import { HTMLAttributes, useCallback } from 'react'

type SessionStatsProps = HTMLAttributes<HTMLDivElement> & {
  lettersTyped: number;
  mistakesCount: number;
  givenTime: number;
}
export const SessionStats = (props : SessionStatsProps) => {

  const {lettersTyped, givenTime, mistakesCount, ...otherProps} = props; 
  const getCPM = useCallback(() => {
    const timeInMinutes = givenTime / 60
    const result = lettersTyped / timeInMinutes;
    return result;
  }, [lettersTyped, givenTime, mistakesCount])

  const cpm = getCPM();
  const wpm = Math.floor(cpm / 5);
  return (
    <div {...otherProps}>
      letters typed: {lettersTyped} | made mistakes: {mistakesCount} | session time: {givenTime}s     
      <p>CPM: {cpm}</p> 
      <p>WPM: {wpm}</p> 
    </div>
  )
}
