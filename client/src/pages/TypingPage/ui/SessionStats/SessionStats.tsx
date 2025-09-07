import { HTMLAttributes } from 'react'
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
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

const calculateAdvancedStats = (logs: {timestamp: number, key: string, isMistake: boolean}[], lettersTyped: number, mistakesCount: number, sessionDurationInSeconds: number) => {
  // Accuracy percentage
  const accuracyPercentage = lettersTyped > 0 ? ((lettersTyped - mistakesCount) / lettersTyped) * 100 : 0;
  
  // Error rate (mistakes per minute)
  const timeInMinutes = sessionDurationInSeconds / 60;
  const errorRate = timeInMinutes > 0 ? mistakesCount / timeInMinutes : 0;
  
  // Most common mistake characters
  const mistakesByChar = logs
    .filter(log => log.isMistake)
    .reduce((acc, log) => {
      acc[log.key] = (acc[log.key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const topMistakeChars = Object.entries(mistakesByChar)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([char, count]) => ({ char, count }));
  
  // Keystroke rhythm consistency
  const correctKeystrokes = logs.filter(log => !log.isMistake);
  const keystrokeIntervals = correctKeystrokes.slice(1).map((log, i) => 
    log.timestamp - correctKeystrokes[i].timestamp
  );
  
  const avgInterval = keystrokeIntervals.length > 0 
    ? keystrokeIntervals.reduce((sum, interval) => sum + interval, 0) / keystrokeIntervals.length 
    : 0;
  
  const variance = keystrokeIntervals.length > 0
    ? keystrokeIntervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / keystrokeIntervals.length
    : 0;
  
  const rhythmConsistency = Math.sqrt(variance);
  
  // Consistent WPM (rolling average over 30-second windows)
  const windowSize = 30; // seconds
  const rollingWPMs = [];
  
  if (logs.length > 0) {
    const startTime = logs[0].timestamp;
    const endTime = logs[logs.length - 1].timestamp;
    const duration = (endTime - startTime) / 1000;
    
    for (let i = 0; i < duration - windowSize; i += 10) { // Check every 10 seconds
      const windowStart = startTime + (i * 1000);
      const windowEnd = windowStart + (windowSize * 1000);
      
      const windowLogs = logs.filter(log => 
        log.timestamp >= windowStart && 
        log.timestamp <= windowEnd && 
        !log.isMistake
      );
      
      if (windowLogs.length > 0) {
        const windowCPM = (windowLogs.length / windowSize) * 60;
        const windowWPM = windowCPM / 5;
        rollingWPMs.push(windowWPM);
      }
    }
  }
  
  const consistentWPM = rollingWPMs.length > 0
    ? rollingWPMs.reduce((sum, wpm) => sum + wpm, 0) / rollingWPMs.length
    : 0;
  
  return {
    accuracyPercentage: Math.round(accuracyPercentage * 100) / 100,
    errorRate: Math.round(errorRate * 100) / 100,
    topMistakeChars,
    rhythmConsistency: Math.round(rhythmConsistency),
    consistentWPM: Math.round(consistentWPM * 100) / 100,
    rollingWPMs
  };
}

export const SessionStats = (props : SessionStatsProps) => {
  const {lettersTyped, sessionDurationInSeconds, mistakesCount, logs, timeWhenSessionOver, ...otherProps} = props; 
  const {cpm, wpm} = convertCharsInCpmAndWpm(sessionDurationInSeconds, lettersTyped)
  const advancedStats = calculateAdvancedStats(logs, lettersTyped, mistakesCount, sessionDurationInSeconds);
  // Note: advancedStats.topMistakeChars is available for detailed analytics views
  
  return (
    <div className={cls.Container} {...otherProps}>
      {/* Primary Metrics - Most Important for Improvement */}
      <div className={cls.primaryStats}>
        <div className={cls.statCard}>
          <div className={cls.statValue}>{advancedStats.accuracyPercentage}%</div>
          <div className={cls.statLabel}>Accuracy</div>
          <div className={cls.statTarget}>Target: 95%+</div>
        </div>
        
        <div className={cls.statCard}>
          <div className={cls.statValue}>{advancedStats.consistentWPM || wpm}</div>
          <div className={cls.statLabel}>Consistent WPM</div>
          <div className={cls.statSubtext}>Average sustained speed</div>
        </div>
        
        <div className={cls.statCard}>
          <div className={cls.statValue}>{advancedStats.errorRate}</div>
          <div className={cls.statLabel}>Errors/min</div>
          <div className={cls.statTarget}>Lower is better</div>
        </div>
      </div>


      {/* Secondary Metrics */}
      <div className={cls.secondaryStats}>
        <div className={cls.statRow}>
          <span>Raw WPM:</span>
          <span>{wpm}</span>
        </div>
        <div className={cls.statRow}>
          <span>CPM:</span>
          <span>{cpm}</span>
        </div>
        <div className={cls.statRow}>
          <span>Letters typed:</span>
          <span>{lettersTyped}</span>
        </div>
        <div className={cls.statRow}>
          <span>Total mistakes:</span>
          <span>{mistakesCount}</span>
        </div>
        <div className={cls.statRow}>
          <span>Rhythm consistency:</span>
          <span>{advancedStats.rhythmConsistency}ms avg variation</span>
        </div>
      </div>

      {/* Performance Chart */}
      <div className={cls.chartSection}>
        <h3>Performance Over Time</h3>
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
  const {logs} = props;

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
    // let start = normalizeTimestamps[0].timestamp;
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
      <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            width={500}
            height={400}
            data={preparedDataForChart}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 5" />
            <XAxis dataKey="interval" />
            <YAxis orientation='left' dataKey='cpm'/> 
            <Tooltip />
            <Area type="monotone" dataKey="cpm" stroke="#8884d8" fill="#8884d8" />
          </ComposedChart>
        </ResponsiveContainer>
    </div>

  )
}

