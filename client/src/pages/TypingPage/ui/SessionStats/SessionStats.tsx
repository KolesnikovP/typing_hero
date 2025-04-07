import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import cls from './SessionStats.module.scss'
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
  const prepareDateForChart = () => {
  
    
  }

  return (
    <div className={cls.Container} {...otherProps}>
      letters typed: {lettersTyped} | made mistakes: {mistakesCount} | session time: {givenTime}s     
      <p>CPM: {cpm}</p> 
      <p>WPM: {wpm}</p> 
        <div>
           <TwoAxisGraph/>
        </div>
    </div>
  )
}


const data = [
  {
    timeStamp: '5s',
    cpm: 240,
    wpm: 55,
    errs: 1,
  },
  {
    timeStamp: '10s',
    cpm: 340,
    wpm: 75,
    errs: 1,
  },
  {
    timeStamp: '15s',
    cpm: 140,
    wpm: 35,
    errs: 1,
  },
  {
    timeStamp: '20s',
    cpm: 240,
    wpm: 55,
    errs: 1,
  },
  {
    timeStamp: '25s',
    cpm: 440,
    wpm: 95,
    errs: 1,
  },
  {
    timeStamp: '30s',
    cpm: 240,
    wpm: 55,
    errs: 1,
  },
];

const TwoAxisGraph = () => {
  const ref = useRef(null);

  return (
    <div className={cls.graphWrapper}>
      <ResponsiveContainer width="80%" height={300}>
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeStamp" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="cpm" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>

    </div>

  )
}
