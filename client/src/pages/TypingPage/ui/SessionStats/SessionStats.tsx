import React, { useCallback } from 'react'
type SessionStatsProps = {
  lettersTyped: number;
  mistakesCount: number;
  givenTime: number;
}
export const SessionStats = (props : SessionStatsProps) => {

  const {lettersTyped, givenTime, mistakesCount} = props; 
  const getCPM = useCallback(() => {
    const timeInMinutes = givenTime / 60
    const result = lettersTyped / timeInMinutes;
    return result;
  }, [lettersTyped, givenTime, mistakesCount])
  return (
    <div>
      letters typed: {lettersTyped} | made mistakes: {mistakesCount} | session time: {givenTime}s     
     <p>your CPM: {getCPM()}</p> 
    </div>
  )
}
