import { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import cls from './SessionStats.module.scss'
type SessionStatsProps = HTMLAttributes<HTMLDivElement> & {
  lettersTyped: number;
  mistakesCount: number;
  logs: {timestamp: number, key: string, isMistake: boolean}[];
  givenTime: number;
  timeWhenSessionOver: number;
}

export const SessionStats = (props : SessionStatsProps) => {
  const {lettersTyped, givenTime, mistakesCount, logs, timeWhenSessionOver, ...otherProps} = props; 

  const getCPM = useCallback(() => {
    const timeInMinutes = givenTime / 60
    const result = lettersTyped / timeInMinutes;
    return result;
  }, [lettersTyped, givenTime, mistakesCount])

  const cpm = getCPM();
  const wpm = Math.floor(cpm / 5);

  return (
    <div className={cls.Container} {...otherProps}>
      letters typed: {lettersTyped} | made mistakes: {mistakesCount} | session time: {givenTime}s     
      <p>CPM: {cpm}</p> 
      <p>WPM: {wpm}</p> 
        <div>
           <TwoAxisGraphTest logs={logs} timeWhenSessionOver={timeWhenSessionOver}/>
        </div>
    </div>
  )
}


type TwoAxisGraphProps = {timeWhenSessionOver: number, logs: {timestamp: number, key: string, isMistake: boolean}[]}
const TwoAxisGraphTest = (props: TwoAxisGraphProps) => {
  const {logs, timeWhenSessionOver} = props;
  const sessionDurationInSeconds = (timeWhenSessionOver - logs[0].timestamp) / 1000
  const ref = useRef(null);

  const normalizeTimestamps = (logs: {timestamp: number, key: string, isMistake: boolean}[]) => {
    if (logs.length === 0) return [];

    const firstTime = logs[0].timestamp;

    return logs.map(log => ({
      ...log,
      timestamp: Number((log.timestamp - firstTime) / 1000), // normalize to seconds and round
    }));
  };

  const groupByInterval = (intervalValue: number, normalizeTimestamps: {timestamp: number, key: string, isMistake: boolean}[]) => {
    let interval = intervalValue;
    let start = normalizeTimestamps[0].timestamp;
    let finish = Math.ceil(normalizeTimestamps[normalizeTimestamps.length - 1].timestamp)

    const result = [];
    let logsInInterval = []
    let charsTyped = 0;
    let mistakesCount = 0;

    for(let i = 0; i < normalizeTimestamps.length; i++) {
      const currentTimeStamp = normalizeTimestamps[i].timestamp;
      if(currentTimeStamp < interval) {
        logsInInterval.push(normalizeTimestamps[i])
        } 
      if(normalizeTimestamps[i].timestamp >= interval) {
        charsTyped = logsInInterval.length;
        mistakesCount = logsInInterval.filter(el => el.isMistake).length 

        result.push({
          interval: interval,
          logsInInterval: logsInInterval,
          charsTyped: charsTyped,
          mistakesCount: mistakesCount
        })

        interval += intervalValue;
        logsInInterval = []

        charsTyped = 0;
        mistakesCount = 0;
      }
    }

    if(logsInInterval.length > 0 && interval > 0 && interval !== finish) {
      result.push({
        interval: finish,
        logsInInterval: logsInInterval,
        charsTyped: logsInInterval.length,
        mistakesCount: logsInInterval.filter(el => el.isMistake).length
     })
    }

    return result;
  }

  const normalizedData = normalizeTimestamps(logs)
  const preparedDataForChart = groupByInterval(2, normalizedData)
  console.log('group by interval', groupByInterval(2, normalizedData))
  console.log('=+++++++++++++++', normalizeTimestamps(logs))
  return (
    <div className={cls.graphWrapper}>
      <ResponsiveContainer width="80%" height={300}>
          <AreaChart
            width={500}
            height={400}
            data={preparedDataForChart}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="interval" />
            <YAxis dataKey="charsTyped"/>
            <Tooltip />
            <Area type="monotone" dataKey="charsTyped" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="mistakesCount" stroke="red" fill="red" />
          </AreaChart>
        </ResponsiveContainer>
    </div>

  )
}

