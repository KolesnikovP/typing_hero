import React from 'react'
type SessionStatsProps = {
  lettersTyped: number;
  mistakesCount: number;
}
export const SessionStats = (props : SessionStatsProps) => {

  const {lettersTyped, mistakesCount} = props; 
  return (
    <div>
      letters typed: {lettersTyped} | made mistakes: {mistakesCount}     
    </div>
  )
}
