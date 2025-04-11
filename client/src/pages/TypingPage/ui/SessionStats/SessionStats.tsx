import { HTMLAttributes, useRef } from 'react'
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ComposedChart } from 'recharts';
import cls from './SessionStats.module.scss'
type SessionStatsProps = HTMLAttributes<HTMLDivElement> & {
  lettersTyped: number;
  mistakesCount: number;
  logs: {timestamp: number, key: string, isMistake: boolean}[];
  sessionDurationInSeconds: number;
  timeWhenSessionOver: number;
}
const convertCharsInCpmAndWpm = (sessionDurationInSeconds: number, totalAmountOfTypedChars: number) => {
  const timeInMinutes = sessionDurationInSeconds / 60
  const cpm = totalAmountOfTypedChars / timeInMinutes;
  const wpm = Math.floor(cpm / 5);

  return {cpm, wpm};
}

export const SessionStats = (props : SessionStatsProps) => {
  const {lettersTyped, sessionDurationInSeconds, mistakesCount, logs, timeWhenSessionOver, ...otherProps} = props; 
  const {cpm, wpm} = convertCharsInCpmAndWpm(sessionDurationInSeconds, lettersTyped)
  console.log(cpm, wpm, "cpm wpm :::::")
  return (
    <div className={cls.Container} {...otherProps}>
      letters typed: {lettersTyped} | made mistakes: {mistakesCount} | session time: {sessionDurationInSeconds}s     
      <p>CPM: {cpm}</p> 
      <p>WPM: {wpm}</p> 
        <div>
           <TwoAxisGraphTest logs={logs} timeWhenSessionOver={timeWhenSessionOver}/>
        </div>
    </div>
  )
}


type TwoAxisGraphProps = {
  timeWhenSessionOver: number,
  logs: {
    timestamp: number,
    key: string,
    isMistake: boolean
  }[],
}

type PreparedDataType = {
          interval: number,
          logsInInterval: {timestamp: number, key: string, isMistake: boolean}[],
          charsTyped: number,
          mistakesCount: number,
          cpm: number,
          wpm: number
}
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

    const result: PreparedDataType[] = [];
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
        const {cpm, wpm} = convertCharsInCpmAndWpm(intervalValue, charsTyped - mistakesCount)

        result.push({
          interval: interval,
          logsInInterval: logsInInterval,
          charsTyped: charsTyped,
          mistakesCount: mistakesCount,
          cpm: cpm,
          wpm: wpm
        })

        interval += intervalValue;
        logsInInterval = []

        charsTyped = 0;
        mistakesCount = 0;
      }
    }

    if(logsInInterval.length > 0 && interval > 0 && interval !== finish) {
        const charsTyped = logsInInterval.length;
        const mistakesCount = logsInInterval.filter(el => el.isMistake).length;
      // im not sure it's right
      const timeOfLastInterval = interval - finish;

      const {cpm, wpm} = convertCharsInCpmAndWpm(timeOfLastInterval, charsTyped - mistakesCount)
      result.push({
        interval: finish,
        logsInInterval: logsInInterval,
        charsTyped: charsTyped,
        mistakesCount: mistakesCount,
        cpm: cpm,
        wpm: wpm,
     })
    }

    return result;
  }

  const normalizedData = normalizeTimestamps(logs)
  const preparedDataForChart = groupByInterval(2, normalizedData)

  return (
    <div className={cls.graphWrapper}>
      <ResponsiveContainer width="80%" height={300}>
          <ComposedChart
            width={500}
            height={400}
            data={preparedDataForChart}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="interval" />
            <YAxis orientation='left' dataKey='cpm'/> 
            <YAxis orientation='right' />
            <Tooltip />

            <Area type="monotone" dataKey="cpm" stroke="#8884d8" fill="#8884d8" />
            <Area type="monotone" dataKey="mistakesCount" stroke="red" fill="red" />
            <Scatter name="mistake" type="number" dataKey="mistakesCount" fill="red" />
          </ComposedChart>
        </ResponsiveContainer>
    </div>

  )
}

